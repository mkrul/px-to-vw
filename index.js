var vwToPxOutput = [];
  var pxToVwOutput = [];
  var vwRegex = /([.?\d]+)(vw)/g;
  var pxRegex = /([.?\d]+)(px)/g;
  var numRegex = /([-.0-9]+)/;

  convertVwToPx = (vw, viewportWidth) => {
    return `${((parseInt(vw) * viewportWidth) / 100).toFixed(2)}px`;
  };

  convertPxToVw = (px, viewportWidth) => {
    return `${((100 * parseInt(px)) / viewportWidth).toFixed(2)}vw`;
  };

  document.getElementById("inputfile").addEventListener("change", () => {
    var reader = new FileReader();
    var viewportWidth = document.getElementById("viewportwidth").value;

    var fileToRead = document.getElementById("inputfile").files[0];

    reader.addEventListener("loadend", () => {
      var text = reader.result;
      var vwLines = text.split("\n");
      for (var line of vwLines) {
        var vwMatches = line.match(vwRegex);
        if (vwMatches === null) {
          vwToPxOutput.push(line);
          continue;
        } else {
          var newLineOutput = [];
          var splitLine = line.split(" ");
          for (var value of splitLine) {
            if (value.match(vwRegex)) {
              var conversion = convertVwToPx(value, viewportWidth);
              newLineOutput.push(conversion);
            } else {
              newLineOutput.push(value);
            }
          }
          vwToPxOutput.push(`${newLineOutput.join(" ")};`);
        }
      }

      var pxOutput = vwToPxOutput.join("\n");
      var pxLines = pxOutput.split("\n");
      for (var line of pxLines) {
        var pxMatches = line.match(pxRegex);
        if (pxMatches === null) {
          pxToVwOutput.push(line);
          continue;
        } else {
          var newLineOutput = [];
          var splitLine = line.split(" ");
          for (var value of splitLine) {
            if (value.match(pxRegex)) {
              var conversion = convertPxToVw(value, viewportWidth);
              newLineOutput.push(conversion);
            } else {
              newLineOutput.push(value);
            }
          }
          if (newLineOutput.includes("@media")) {
            // get second to last item in the array
            var secondToLastItem = newLineOutput[newLineOutput.length - 2];
            // append ")" to the second to last item
            newLineOutput[newLineOutput.length - 2] = `${secondToLastItem})`;
            pxToVwOutput.push(`${newLineOutput.join(" ")}`);
          } else {
            pxToVwOutput.push(`${newLineOutput.join(" ")};`);
          }
        }
      }
      document.getElementById("file").innerText = pxToVwOutput.join("\n");
    });
    reader.readAsText(fileToRead);
  });

  document.getElementById("reset").onclick = () => {
    location.reload();
  };

function copyToClipboard() {
  var container = document.getElementById("file");
  var range = document.createRange();
  range.selectNode(container);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  alert("Copied to clipboard!");
}