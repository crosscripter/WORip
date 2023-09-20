(async function WORip() {
    const log = (...args) => console.log(
        `%cWORip%c\u2b9e %c${new Date().toISOString()}: %c${args.join(' ')}`, 
        'color:limeGreen;font-family:monospace;letter-spacing:3px;', 
        'font-weight:bold;color:green;', 
        'font:#aaa;',
        'font:#fff;')

    const pause = async timeout => new Promise(res => setTimeout(() => res(true), timeout))

    log('Initializing script...')
    const find = (sel, fail) => {
        const el = document.querySelector(sel) 
        if (fail && !el) throw `Could not find ${sel} on page`
        return el
    }

    const rclick = el => {
        const { x, y } = el.getBoundingClientRect()
        return el.dispatchEvent(new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: false,
            view: window,
            button: 2,
            buttons: 0,
            clientX: x,
            clientY: y
        }))
    }

    log('Waiting for page to load...')
    await pause(3000)
    log('Page loaded!')

    log('Finding video wrapper...')
    const videoWrapper = find(`.w-video-wrapper`)
    log('videoWrapper found', videoWrapper)
    rclick(videoWrapper)
    
    log('Waiting for context menu...')
    await pause(3000)
    let copyLinkButton
    copyLinkButton = find(`.w-context-menu button[islastitem]`, false)
    log('Context menu shown')

    log('Finding copy link...')
    log('copyLinkButton found', copyLinkButton)

    // Must focus the body first 
    // we wouldn't want any scripts reading our clipboard...oh wait?
    log("Focusing document...")
    chrome.openDevTools(false)

    log('Clicking copy link...')
    copyLinkButton.focus()
    copyLinkButton.click()

    log("Copying clipboard contents...")
    await pause(3000)
    const url = await navigator.clipboard.readText()
    log(`Copy link clicked. Clipboard contains url "${url}"`)
    chrome.openDevTools()

})()

