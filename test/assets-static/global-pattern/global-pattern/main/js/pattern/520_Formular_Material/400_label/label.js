// we try to suppress animations on page load
window.o_global.eventLoader.onAllScriptsExecuted(130, () => {
  window.setTimeout(() => {
    const className = "js-p_label";
    const elements = document.querySelectorAll(`.${className}`);
    const eventName = "change";
    const handler = function () {
      this.setAttribute("value", this.value);
    };
    [].forEach.call(elements, (el) => {
      if (el.previousElementSibling) {
        // Edge-Browser, IE11 workaround
        el.previousElementSibling.addEventListener(eventName, handler);
        el.previousElementSibling.addEventListener("init", handler);
      }

      el.classList.remove(className);
    });

    const classNameDropdown = "js-p_dropdown__element";
    const dropDownElements = document.querySelectorAll(`.${classNameDropdown}`);

    [].forEach.call(dropDownElements, (el) => {
      el.dispatchEvent(new Event(eventName));
    });
  }, 500);
});
