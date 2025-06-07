function oleToRGB() {
    var oleColorInput = document.getElementById("oleColor").value;
    
    // Remove the '&H' prefix if it exists
    if (oleColorInput.startsWith('&H')) {
        oleColorInput = oleColorInput.substring(2);
    }
    
    // Remove the trailing '&' if it exists
    if (oleColorInput.endsWith('&')) {
        oleColorInput = oleColorInput.slice(0, -1);
    }
    
    var oleColor = parseInt(oleColorInput, 16);
    if (isNaN(oleColor)) {
        document.getElementById("result").innerText = "Invalid OLE input.";
        return;
    }
    
    var red = oleColor & 0xFF;
    var green = (oleColor >> 8) & 0xFF;
    var blue = (oleColor >> 16) & 0xFF;
    
    document.getElementById("result").innerText = "RGB: (" + red + ", " + green + ", " + blue + ")";
}

function rgbToOLE() {
    var red = parseInt(document.getElementById("red").value);
    var green = parseInt(document.getElementById("green").value);
    var blue = parseInt(document.getElementById("blue").value);
    if ([red, green, blue].some(v => isNaN(v) || v < 0 || v > 255)) {
        document.getElementById("oleResult").innerText = "Invalid RGB input.";
        return;
    }
    var oleColor = (blue << 16) + (green << 8) + red;
    var oleColorHex = oleColor.toString(16).toUpperCase().padStart(6, '0'); // Ensure 6 characters
    // Output in the desired format
    var outputWithPrefix = `OLE Color: &H${oleColorHex}&`;
    document.getElementById("oleResult").innerText = outputWithPrefix;
    document.getElementById('colorPreview').style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
}

function copyToClipboard() {
    const oleResult = document.getElementById('oleResult').innerText;
    if (!oleResult) {
        alert("Nothing to copy.");
        return;
    }
    navigator.clipboard.writeText(oleResult).then(() => {
        alert('Copied to clipboard: ' + oleResult);
    });
}

function clearOLEInput() {
    document.getElementById("oleColor").value = "";
    document.getElementById("result").innerText = "";
}

function clearRGBInputs() {
    document.getElementById("red").value = "";
    document.getElementById("green").value = "";
    document.getElementById("blue").value = "";
    document.getElementById("oleResult").innerText = "";
    document.getElementById('colorPreview').style.backgroundColor = "transparent";
}

document.getElementById('toggleMode').addEventListener('click', toggleMode);
