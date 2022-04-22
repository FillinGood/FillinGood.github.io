// @ts-check
(async () => {
  const pages = [
    ["TrelLike", "/TrelLike"],
    ["FillinGood.github.io", "/"],
  ];

  const ghCache = await fetch(
    "https://api.github.com/search/repositories?q=user:FillinGood"
  )
    .then((x) => x.json())
    .then((x) =>
      x.items.reduce((a, x) => ({ ...a, [x.name]: x.description ?? "" }), {})
    );
  console.debug(ghCache);

  /**
   * Create a new HTML element
   * @param {K} name
   * @param {Partial<HTMLElementTagNameMap[K]> | null} props
   * @param {...(Node | string)} children
   * @template {keyof HTMLElementTagNameMap} K
   * @return {HTMLElementTagNameMap[K]}
   */
  function el(name, props, ...children) {
    const e = document.createElement(name);
    if (props) {
      for (const key in props) {
        e[key] = props[key];
      }
    }
    if (children) {
      for (const child of children) {
        if (typeof child === "string")
          e.appendChild(document.createTextNode(child));
        else e.appendChild(child);
      }
    }
    return e;
  }
  function sleep(ms) {
    return new Promise((res) => setTimeout(() => res(), ms));
  }

  /**
   * Get GH repository short description
   * @param {string} repo
   * @return {string|null}
   */
  function getDescription(repo) {
    return ghCache[repo] ?? null;
  }
  /**
   * @param {string} text
   * @return {Element}
   */
  function elFromString(text) {
    const tpl = el("template", { innerHTML: text.trim() });
    return tpl.content.firstElementChild;
  }

  async function onload() {
    const app = document.getElementById("app");
    const ghText = await fetch("/github.svg").then((x) => x.text());

    let height = app.getBoundingClientRect().height;
    app.style.height = height + "px";
    app.classList.add("animate");

    /** @type {Record<'name'|'app'|'repo'|'description', string>[]} */
    const repos = pages.map(([name, app]) => ({
      name,
      app,
      repo: "https://github.com/FillinGood/" + name,
      description: getDescription(name),
    }));
    console.debug(repos);

    for (const repo of repos) {
      const item = el(
        "div",
        { className: "repo new-item" },
        el(
          "a",
          { className: "name", href: repo.app },
          el("span", null, repo.name),
          el("a", { href: repo.repo }, elFromString(ghText))
        ),
        el(
          "div",
          { className: "description" },
          repo.description ||
            el(
              "span",
              { className: "error" },
              repo.description === null ? "Not found" : "No description"
            )
        )
      );
      app.appendChild(item);
      await sleep(400);
      item.classList.remove("new-item");
      height += item.getBoundingClientRect().height;
      app.style.height = height + "px";
    }
    await sleep(400);
    app.classList.add("end");
    height += 5 * repos.length;
    app.style.height = height + "px";
    await sleep(600);
    app.style.height = "";
  }

  document.onreadystatechange = function () {
    if (document.readyState === "complete") onload();
  };
  if (document.readyState === "complete") onload();
})();
