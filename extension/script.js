const loadValues = ({interval=500, timeout=20000} = {}) => {
  return new Promise(resolve => {
    let timer = null, stop = () => resolve(clearInterval(timer));

    timer = setInterval(() => {
      $loadMore = document.querySelector(".azc-grid-pageable-loadMoreContainer");
      if ($loadMore && !$loadMore.classList.contains("fxs-display-none")) {
        $loadMore?.click();
      } else {
        stop();
      }
    }, interval);

    setTimeout(stop, timeout);
  });
};

const getValueRows = () => [...document.querySelectorAll(".azc-grid-full > tbody > tr")];

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

document.body.addEventListener("keyup", ev => {
  if (ev.ctrlKey && ev.shiftKey) {
    switch(ev.key) {
      case "L": {
        loadValues();
        break;
      }
      case "F": {
        const term = prompt("Term?");
        term && filterValues(term);
        break;
      }
      case "Z": {
        filterValues('');
        break;
      }
      case "Q": {
        const term = prompt("Term?");
        term && loadAndFilterValues(term);
        break;
      }
    }
  }
})