<script>
  import { onMount } from "svelte";
  import { tick } from "svelte";

  let currentProgress = 0;
  let durationMs = 0;
  let lastTrackId = null;
  let isPlaying = false;
  let isLoading = false;
  let isAd = false;
  let progressInterval;
  let fetchInterval;

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function showLoadingState() {
    if (isLoading) return;
    isLoading = true;

    const widget = document.querySelector(".spotify-now-playing");
    if (!widget) return;

    widget.classList.add("spotify-loading");

    const albumArt = document.getElementById("spotify-album-art");
    albumArt.innerHTML = '<div class="spotify-spinner"></div>';
    albumArt.className = "spotify-album-art spotify-album-loading";
    albumArt.style.backgroundImage = "none";

    document.getElementById("spotify-track-name").innerHTML =
      '<div class="spotify-skeleton spotify-track-name-skeleton"></div>';

    document.getElementById("spotify-artist-name").innerHTML =
      '<div class="spotify-skeleton spotify-artist-name-skeleton"></div>';

    const progressBar = document.getElementById("spotify-progress-bar");
    progressBar.className = "spotify-skeleton";
    progressBar.style.width = "100%";

    document.getElementById("spotify-time-display").innerHTML =
      '<div class="spotify-skeleton spotify-time-skeleton"></div>';
  }

  function hideLoadingState() {
    if (!isLoading) return;
    isLoading = false;

    const widget = document.querySelector(".spotify-now-playing");
    const albumArt = document.getElementById("spotify-album-art");
    const progressBar = document.getElementById("spotify-progress-bar");

    widget.classList.remove("spotify-loading");
    albumArt.classList.remove("spotify-album-loading");
    albumArt.innerHTML = "";
    progressBar.classList.remove("spotify-skeleton");

    widget.classList.add("spotify-fade-in");
    setTimeout(() => widget.classList.remove("spotify-fade-in"), 500);
  }

  async function fetchSpotifyNowPlaying() {
    try {
      if (lastTrackId === null) showLoadingState();

      const response = await fetch("https://spotify-npp.onrender.com/nowplaying");

      if (!response.ok) throw new Error("Spotify unreachable.");

      const data = await response.json();

      if (data.currently_playing_type === "ad" || data.item === null) {
        hideLoadingState();
        isAd = true;
        lastTrackId = null;
        isPlaying = true;
        currentProgress = data.progress_ms ?? 0;
        durationMs = data.duration_ms ?? 30000;

        document.getElementById("spotify-track-name").textContent = "Advertisement";
        document.getElementById("spotify-artist-name").textContent = "Spotify Ads";

        const albumArtElement = document.getElementById("spotify-album-art");
        albumArtElement.style.backgroundImage = "none";
        albumArtElement.className = "spotify-album-art";

        document.getElementById("spotify-progress-bar").style.width =
          `${(currentProgress / durationMs) * 100}%`;

        document.getElementById("spotify-time-display").textContent =
          `${formatTime(currentProgress)} / ${formatTime(durationMs)}`;

        return;
      }

      isAd = false;

      const track = data.item;
      const trackId = track.id;

      const newProgress = data.progress_ms;
      const newDuration = track.duration_ms;
      const playing = data.is_playing;

      const timeJump = Math.abs(newProgress - currentProgress) > 3000;
      const trackChanged = trackId !== lastTrackId;

      if (trackChanged || timeJump || playing !== isPlaying) {
        hideLoadingState();

        document.getElementById("spotify-track-name").textContent = track.name;
        document.getElementById("spotify-artist-name").textContent =
          track.artists.map((a) => a.name).join(", ");

        const albumArt = track.album.images[0].url;
        const albumArtElement = document.getElementById("spotify-album-art");
        albumArtElement.style.backgroundImage = `url(${albumArt})`;
        albumArtElement.className = "spotify-album-art";

        if (trackChanged) {
          try {
            const dominantColor = await extractAlbumColor(albumArt);
            applyDynamicTheme(dominantColor);
          } catch {}
        }

        lastTrackId = trackId;
      }

      currentProgress = newProgress;
      durationMs = newDuration;
      isPlaying = playing;

      const percent = (currentProgress / durationMs) * 100;
      document.getElementById("spotify-progress-bar").style.width = `${percent}%`;

      document.getElementById("spotify-time-display").textContent =
        `${formatTime(currentProgress)} / ${formatTime(durationMs)}`;

      clearInterval(progressInterval);

      if (isPlaying) {
        progressInterval = setInterval(() => {
          currentProgress += 1000;
          if (currentProgress >= durationMs) {
            clearInterval(progressInterval);
            return;
          }

          const updatedPercent = (currentProgress / durationMs) * 100;
          document.getElementById("spotify-progress-bar").style.width =
            `${updatedPercent}%`;

          document.getElementById("spotify-time-display").textContent =
            `${formatTime(currentProgress)} / ${formatTime(durationMs)}`;
        }, 1000);
      }
    } catch (err) {
      hideLoadingState();

      const widget = document.querySelector(".spotify-now-playing");
      widget.classList.add("spotify-error");

      document.getElementById("spotify-track-name").textContent =
        "Nothing Playing";
      document.getElementById("spotify-artist-name").textContent =
        "Spotify idle…";

      document.getElementById("spotify-album-art").style.backgroundImage = "none";

      document.getElementById("spotify-progress-bar").style.width = "0%";
      document.getElementById("spotify-time-display").textContent =
        "0:00 / 0:00";

      clearInterval(progressInterval);
      lastTrackId = null;
      isPlaying = false;

      setTimeout(() => widget.classList.remove("spotify-error"), 300);
    }
  }

  onMount(() => {
    const widget = document.querySelector(".spotify-now-playing");

    if (widget) {
      widget.addEventListener("click", () => {
        if (!isAd && lastTrackId) {
          window.open(`https://open.spotify.com/track/${lastTrackId}`, "_blank");
        }
      });
    }

    fetchSpotifyNowPlaying();
    fetchInterval = setInterval(fetchSpotifyNowPlaying, 2500);
  });
</script>

<section id="spotify-widget-section">
  <div class="spotify-now-playing">
    <div class="spotify-album-art" id="spotify-album-art"></div>

    <div class="spotify-track-info">
      <div id="spotify-track-name">Loading...</div>
      <div id="spotify-artist-name">...</div>
      <div class="spotify-progress-container">
        <div id="spotify-progress-bar"></div>
      </div>
      <div class="spotify-time-display" id="spotify-time-display">
        0:00 / 0:00
      </div>
    </div>
  </div>
</section>
