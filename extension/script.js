const getVisibleElements = (selector) =>
  [...document.querySelectorAll(selector)]
  .filter(it => it.checkVisibility())

const loadValues = ({interval=250, timeout=30000} = {}) => {
  return new Promise(resolve => {
    let timer = null, stop = () => resolve(clearInterval(timer))

    timer = setInterval(() => {
      var $loadMores = getVisibleElements(".azc-grid-pageable-loadMoreContainer")

      for (let $loadMore of $loadMores) {
        if (!$loadMore.classList.contains("fxs-display-none")) {
          $loadMore?.click()
          return
        }
      }

      stop();
    }, interval)

    setTimeout(stop, timeout)
  });
};

const getValueRows = () =>
  getVisibleElements(".azc-grid-full").flatMap(it => [...it.querySelectorAll("tbody > tr")])

const filterValues = (term) => {
  return getValueRows().filter((tr) => {
    const matched = new RegExp(term, "gi").test(tr.innerText);
    tr.style.display = matched ? "" : "none";
    return matched;
  });
};

const resetFilter = () => {
  getValueRows().forEach((tr) => {
    tr.style.display = "";
  });
};

const loadAndFilterValues = async (term) => {
  await loadValues();
  filterValues(term);
};

const actions = {
  "Q": function LoadAndFilterRows() {
    const term = prompt("Term?");
    term && loadAndFilterValues(term);
  },
  "L": function LoadRows() {
    loadValues();
  },
  "F": function FilterRows() {
    const term = prompt("Term?");
    term && filterValues(term);
  },
  "Z": function ResetRows() {
    resetFilter();
  }
}

document.body.addEventListener("keyup", ev => {
  if (ev.ctrlKey) {
    if (ev.key === '/') {
      alert(Object.entries(actions).map(it => `Ctrl + Shift + ${it[0]} : ${it[1].name.replace(/([A-Z])/g, ' $1').trim()}`).join('\n'))
    } else if (ev.shiftKey) {
      const action = actions[ev.key]
      action && action()
    }
  }
});
