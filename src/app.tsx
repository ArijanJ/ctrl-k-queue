async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  function isModal(element) {
    return (element.parentNode && element.parentNode.className == "search-modal-inputContainer")
  }

  // THis sucks
  let original = Spicetify.Mousetrap.prototype.stopCallback
  Spicetify.Mousetrap.prototype.stopCallback = (e, el, _) => {
    if(isModal(el) && e.key == "q") return false;
    return el.tagName == 'INPUT' || el.tagName == 'SELECT' || el.tagName == 'TEXTAREA' || (el.contentEditable && el.contentEditable == 'true');
  }

  Spicetify.Mousetrap.bind('ctrl+q', (e, c) => {
    let selected = document.querySelector('.search-modal-modalWrapper > #search-modal-listbox > .search-modal-isSelected')
    if(!selected) return

    if(selected.href.includes('/album/')) {
      Spicetify.showNotification("Cannot add an album to queue", true)
      return
    }

    let trackID = selected.href.split('/').pop()

    let name = selected.children[2].children[0].innerText

    Spicetify.addToQueue([{uri: `spotify:track:${trackID}`}])
    Spicetify.showNotification(`Added ${name} to queue`)
  })
}

export default main;
