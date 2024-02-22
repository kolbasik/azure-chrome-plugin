const makePersistentProperty = (key, defaultValue, valueOf = (it) => it) =>
  (value) => {
    if (typeof value !== "undefined") {
      return localStorage.setItem(key, value);
    }
    return valueOf(localStorage.getItem(key)) || defaultValue
  };

const MaxTimeoutInSeconds = makePersistentProperty("KOLBASIK__MAX_TIMEOUT", 30000, it => parseInt(it, 10));

const getVisibleElements = (selector) =>
  [...document.querySelectorAll(selector)]
    .filter((it) => it.checkVisibility());

const loadMore = () => {
  const $loadMores = getVisibleElements(".azc-grid-pageable-loadMoreContainer");

  for (let $loadMore of $loadMores) {
    if (!$loadMore.classList.contains("fxs-display-none")) {
      $loadMore?.click();
      return true;
    }
  }

  return false;
}
const loadValues = ({ interval = 250, teardown = 500, timeoutInSeconds = MaxTimeoutInSeconds() } = {}) => {
  return new Promise((resolve) => {
    let timer = null;

    let stop = () => {
      clearInterval(timer);
      setTimeout(resolve, teardown); // give a chance to load the last requested chuck.
    };

    timer = setInterval(() => loadMore() || stop(), interval);

    setTimeout(stop, timeoutInSeconds * 1000);
  });
};

const getValueRows = () =>
  getVisibleElements(".azc-grid-full")
    .flatMap((it) => [...it.querySelectorAll("tbody > tr")]);

const filterValues = (keyword) => {
  if (keyword) {
    getValueRows().forEach((tr) => {
      const matched = new RegExp(keyword, "gi").test(tr.innerText);
      tr.style.display = matched ? "" : "none";
    });
  }
};

const resetFilter = () => {
  getValueRows().forEach((tr) => {
    tr.style.display = "";
  });
};

const loadAndFilterValues = (keyword) => {
  loadValues()
    .then(() => filterValues(keyword));
};

const help = ["Plugin is great to check KeyVault Secrets, Activity or Sign-in logs, or Blobs in a Storage Account Container, etc...\n"];

  // 'CTRL+SHIFT+F - TITLE'
const bindKey = (title, handler) => {
  help.push(title);

  const keys = title.split(" - ", 2).at(0).toUpperCase().split("+");
  const options = {
    key: keys.at(-1),
    ctrlKey: keys.includes("CTRL"),
    shiftKey: keys.includes("SHIFT")
  };

  document.addEventListener("keydown", event => {
    if (event.ctrlKey === options.ctrlKey && event.shiftKey === options.shiftKey && event.key.toUpperCase() === options.key) {
      event.preventDefault();
      event.stopImmediatePropagation();
      handler(event, options);
    }
  });
};

bindKey("Shift+T - Set MAX timeout in seconds.", () => MaxTimeoutInSeconds(prompt("Enter the MAX timeout in seconds:")));
bindKey("Shift+N - Click on 'Load More' button once.", loadMore);
bindKey("Shift+L - Keep 'Load More' until MAX timeout.", loadValues);
bindKey("Shift+F - Filter by keyword.", () => filterValues(prompt("Enter the keyword to filter on:")));
bindKey("Ctrl+Shift+F - Load more and filter by keyword.", () => loadAndFilterValues(prompt("Enter the keyword to load more and filter on:")));
bindKey("Shift+Z - Reset the filter.", resetFilter);
bindKey("Ctrl+/ - Help.", () => alert(help.join("\n")));
