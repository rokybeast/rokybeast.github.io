document.addEventListener("DOMContentLoaded", () => {
    const languagesContainer = document.getElementById("languages-container");
    const searchInput = document.getElementById("search-input");
    const noResults = document.getElementById("no-results");
    let allLanguages = [];

    async function JsonLoader() {
        try {
            const response = await fetch("helloworlds.json");
            if (response.ok) {
                const jsonData = await response.json();
                allLanguages = jsonData;
            } else {
                allLanguages = [];
            }
            renderLanguages(allLanguages);
            console.log(allLanguages);
        } catch (error) {
            console.error("Failed to load JSON:", error);
            allLanguages = [];
            renderLanguages(allLanguages);
        }
    }
    JsonLoader();

    function renderLanguages(languages) {
        languagesContainer.innerHTML = "";

        if (languages.length === 0) {
            languagesContainer.style.display = "none";
            noResults.classList.remove("d-none");
            return;
        }

        languagesContainer.style.display = "block";
        noResults.classList.add("d-none");

        languages.forEach((lang, index) => {
            const cardElement = document.createElement("div");
            cardElement.className = "masonry-item";
            cardElement.innerHTML = `
                <div class="card card-hover shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="fw-bold">${escapeHtml(
                            lang.language
                        )}</span>
                        <button class="btn btn-sm btn-light copy-btn" data-clipboard-target="#code-${index}">
                            Copy
                        </button>
                    </div>
                    <div class="card-body p-0">
                        <pre class="m-0"><code id="code-${index}" class="language-${
                lang.prism_lang
            }">${escapeHtml(lang.code)}</code></pre>
                    </div>
                </div>
            `;
            languagesContainer.appendChild(cardElement);
        });

        Prism.highlightAll();

        document.querySelectorAll(".copy-btn").forEach((button) => {
            button.addEventListener("click", handleCopyClick);
        });
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function handleCopyClick(event) {
        const button = event.target;
        const targetSelector = button.getAttribute("data-clipboard-target");
        const codeElement = document.querySelector(targetSelector);
        const codeToCopy = codeElement.innerText;

        navigator.clipboard
            .writeText(codeToCopy)
            .then(() => {
                button.textContent = "Copied!";
                button.classList.remove("btn-light");
                button.classList.add("btn-success");

                setTimeout(() => {
                    button.textContent = "Copy";
                    button.classList.remove("btn-success");
                    button.classList.add("btn-light");
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
                const textArea = document.createElement("textarea");
                textArea.value = codeToCopy;
                document.body.appendChild(textArea);
                textArea.select();

                try {
                    document.execCommand("copy");
                    button.textContent = "Copied!";
                    button.classList.remove("btn-light");
                    button.classList.add("btn-success");
                } catch (err) {
                    console.error("Failed to copy text: ", err);
                    button.textContent = "Error";
                    button.classList.add("btn-danger");
                }

                document.body.removeChild(textArea);

                setTimeout(() => {
                    button.textContent = "Copy";
                    button.classList.remove("btn-success", "btn-danger");
                    button.classList.add("btn-light");
                }, 2000);
            });
    }

    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredLanguages = allLanguages.filter((lang) =>
            lang.language.toLowerCase().includes(searchTerm)
        );
        renderLanguages(filteredLanguages);
    });
});
