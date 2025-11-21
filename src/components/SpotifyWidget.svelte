<script>
  import { onMount } from "svelte";
  import { tick } from "svelte";

  let currentProgress = 0;
  let durationMs = 0;
  let lastTrackId = null;
  let isPlaying = false;
  let isLoading = false;
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

  function extractAlbumColor(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorMap = {};
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = (r + g + b) / 3;
          if (brightness < 50 || brightness > 200) continue;
          const color = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
          colorMap[color] = (colorMap[color] || 0) + 1;
        }
        let dominantColor = "limegreen";
        let maxCount = 0;
        for (const color in colorMap) {
          if (colorMap[color] > maxCount) {
            maxCount = colorMap[color];
            dominantColor = `rgb(${color})`;
          }
        }
        resolve(dominantColor);
      };
      img.onerror = () => resolve("limegreen");
      img.src = imageUrl;
    });
  }

  function applyDynamicTheme(dominantColor) {
    const widget = document.querySelector(".spotify-now-playing");
    const progressBar = document.getElementById("spotify-progress-bar");
    const rgbMatch = dominantColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      const accentColor = dominantColor;
      const accentLight = `rgba(${r}, ${g}, ${b}, 0.2)`;
      const accentGlow = `rgba(${r}, ${g}, ${b}, 0.4)`;
      widget.style.setProperty("--accent-color", accentColor);
      widget.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
      progressBar.style.backgroundColor = accentColor;
      progressBar.style.boxShadow = `0 0 10px ${accentGlow}`;
      widget.style.background = `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.1) 0%, rgba(${r}, ${g}, ${b}, 0.05) 100%)`;
      widget.style.border = `1px solid ${accentLight}`;
    }
  }

  async function fetchSpotifyNowPlaying() {
    try {
      if (lastTrackId === null) showLoadingState();
      const response = await fetch(
        "https://spotify-npp.onrender.com/nowplaying",
      );
      if (!response.ok) throw new Error("Spotify not reachable");
      const data = await response.json();
      if (!data.item) throw new Error("Nothing is playing");
      const track = data.item;
      const trackId = track.id;
      const newProgress = data.progress_ms;
      const newDuration = track.duration_ms;
      const playing = data.is_playing;
      const timeJump = Math.abs(newProgress - currentProgress) > 3000;
      const trackChanged = trackId !== lastTrackId;
      if (trackChanged || timeJump || playing !== isPlaying) {
        const trackName = track.name;
        const artistName = track.artists.map((a) => a.name).join(", ");
        const albumArt = track.album.images[0].url;
        hideLoadingState();
        document.getElementById("spotify-track-name").textContent = trackName;
        document.getElementById("spotify-artist-name").textContent = artistName;
        const albumArtElement = document.getElementById("spotify-album-art");
        albumArtElement.style.backgroundImage = `url(${albumArt})`;
        albumArtElement.className = "spotify-album-art";
        if (trackChanged) {
          try {
            const dominantColor = await extractAlbumColor(albumArt);
            applyDynamicTheme(dominantColor);
          } catch (e) {
            console.log("Color extraction failed, using default");
          }
        }
        lastTrackId = trackId;
      }
      currentProgress = newProgress;
      durationMs = newDuration;
      isPlaying = playing;
      const percent = (currentProgress / durationMs) * 100;
      document.getElementById("spotify-progress-bar").style.width =
        `${percent}%`;
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
        "Spotify idle...";
      document.getElementById("spotify-album-art").style.backgroundImage =
        "none";
      document.getElementById("spotify-album-art").className =
        "spotify-album-art";
      document.getElementById("spotify-progress-bar").style.width = "0%";
      document.getElementById("spotify-time-display").textContent =
        "0:00 / 0:00";
      const progressBar = document.getElementById("spotify-progress-bar");
      widget.style.background = "";
      widget.style.border = "";
      progressBar.style.backgroundColor = "var(--accent-color, limegreen)";
      progressBar.style.boxShadow = "";
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
        if (lastTrackId && lastTrackId !== null) {
          window.open(
            `https://open.spotify.com/track/${lastTrackId}`,
            "_blank",
          );
        }
      });
    }

    // initial fetch & intervals
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
