(function () {
  var GATES = {
    pathfinder: {
      password: "123123",
      storageKey: "portfolio-gate-pathfinder",
    },
  };

  function isAuthorized(key) {
    var gate = GATES[key];
    if (!gate) return true;
    try {
      return sessionStorage.getItem(gate.storageKey) === "1";
    } catch (err) {
      return false;
    }
  }

  function authorize(key) {
    var gate = GATES[key];
    if (!gate) return;
    try {
      sessionStorage.setItem(gate.storageKey, "1");
    } catch (err) {}
  }

  function promptPassword(key) {
    var gate = GATES[key];
    if (!gate) return true;
    var pwd = window.prompt("This case study is not public. Enter password:");
    if (pwd === null) return false;
    if (pwd === gate.password) {
      authorize(key);
      return true;
    }
    window.alert("Incorrect password.");
    return false;
  }

  function tryEnter(key, url) {
    if (isAuthorized(key) || promptPassword(key)) {
      window.location.href = url;
    }
  }

  window.portfolioWorkGate = {
    tryEnter: tryEnter,
    isAuthorized: isAuthorized,
  };

  var pageKey = document.documentElement.getAttribute("data-work-protected-gate");
  if (pageKey) {
    if (!isAuthorized(pageKey)) {
      if (!promptPassword(pageKey)) {
        window.location.replace("../index.html#works");
        return;
      }
    }
    document.documentElement.classList.add("work-protected-gate--authorized");
  }
})();
