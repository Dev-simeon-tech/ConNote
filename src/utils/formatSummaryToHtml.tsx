export const formatSummaryToHTML = (summary: string): string => {
  // Split into lines
  const lines = summary.split("\n");
  let html = "";
  let inList = false;

  for (let line of lines) {
    line = line.trim();

    // Detect section heading
    if (/^[A-Z][\w\s]+:$/.test(line)) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<h2>${line.replace(/:$/, "")}</h2>`;
    }

    // Detect bullet point
    else if (/^(\*|-|\d+\.)\s+/.test(line)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${line.replace(/^(\*|-|\d+\.)\s+/, "")}</li>`;
    }

    // Handle paragraph or single line
    else if (line !== "") {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<p>${line}</p>`;
    }
  }

  // Close list if still open
  if (inList) {
    html += "</ul>";
  }

  return html;
};
