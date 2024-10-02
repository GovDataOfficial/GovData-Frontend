const addClass = (selector: string, className: string) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    element.classList.add(className);
  });
};

const removeClass = (selector: string, className: string) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.classList.remove(className);
  });
};

const removeAttribute = (selector: string, attributeName: string) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.removeAttribute(attributeName);
  });
};

const addAttribute = (
  selector: string,
  attributeName: string,
  value: string,
) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.setAttribute(attributeName, value);
  });
};

const focusCloseButton = () => {
  const button = document.getElementById("off-canvas-close-toggle");
  if (button) {
    button.focus();
  }
};

export const hideOffCanvas = () => {
  addAttribute(".off-canvas-inner-wrap a", "tabindex", "-1");
  addAttribute(".off-canvas-inner-wrap button", "tabindex", "-1");
  addAttribute(".right-off-canvas-toggle", "aria-expanded", "false");
  addAttribute(".btn-navbar", "aria-expanded", "false");
  addAttribute("#off-canvas-close-toggle", "aria-expanded", "false");
  addAttribute(".gd-offcanvas", "aria-hidden", "true");

  removeClass(".gd-offcanvas", "open");
  removeClass("body", "overflow-hidden");
};

export const showOffCanvas = (section: "mainmenu" | "filter") => {
  addClass("body", "overflow-hidden");
  addClass(".off-canvas-container", "d-none");

  addAttribute(".gd-offcanvas", "aria-hidden", "false");
  addAttribute("#off-canvas-close-toggle", "aria-expanded", "true");

  removeAttribute(".off-canvas-inner-wrap a", "tabindex");
  removeAttribute(".off-canvas-inner-wrap button", "tabindex");

  const sectionSelector = `#off-canvas-${section}`;
  removeClass(sectionSelector, "d-none");

  const toggle = `#off-canvas-${section}-toggle`;
  addAttribute(toggle, "aria-expanded", "true");

  addClass(".gd-offcanvas", "open");

  //dirty hack
  setTimeout(() => {
    focusCloseButton();
  }, 100);
};
