module.exports = function safeDescription(description) {
    return description.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")
  }
