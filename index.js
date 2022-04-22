// @ts-check
(() => {
  /**
   * List of pages to display on main page.
   * @type {string[]}
   */
  const pages = [];

  /**
   * Create a new HTML element
   * @param {K} name
   * @param {({children:(HTMLElement|string)[]} & Record<string, any>)} [props]
   * @template {keyof HTMLElementTagNameMap} K
   * @return {HTMLElementTagNameMap[K]}
   */
  function el(name, props) {
    const e = document.createElement(name);
    if (props) {
      for (const key in props) {
        if (key === "children") {
          for (const child of props.children) {
            if (typeof child === "string")
              e.appendChild(document.createTextNode(child));
            else e.appendChild(child);
          }
        } else {
          e[key] = props[key];
        }
      }
    }
    return e;
  }

  function onload() {
    const table = document.getElementById("pages");
    pages
      .map((x) =>
        el("tr", {
          children: [
            el("td", {
              children: [
                el("a", {
                  children: [x],
                  href: "/" + x,
                }),
              ],
            }),
            el("td", {
              children: [
                "(",
                el("a", {
                  children: ["git"],
                  href: ["https://github.com/FillinGood/" + x],
                }),
                ")",
              ],
            }),
          ],
        })
      )
      .forEach((x) => table.appendChild(x));
  }

  document.onreadystatechange = function () {
    if (document.readyState === "interactive") onload();
  };
})();
