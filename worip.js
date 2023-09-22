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

    const downloadVideo = async () => {
        log('Finding video wrapper...')
        const videoWrapper = find(`.w-video-wrapper`)
        log('videoWrapper found', videoWrapper)
        rclick(videoWrapper)
        
        log('Waiting for context menu...')
        await pause(3000)

        log('Finding copy link...')
        let copyLinkButton
        copyLinkButton = find(`.w-context-menu button[islastitem]`, true)
        log('copyLinkButton found', copyLinkButton)

        log('Clicking copy link...')
        copyLinkButton.click()
        log('Context menu shown')

        log("Copying clipboard contents...")
        await pause(3000)
        const url = await navigator.clipboard.readText()
        log(`Copy link clicked. Clipboard contains url "${url}"`)

        log("Extracting Wisitia video id from copied url...")
        const wvideo = url.split('wvideo=')[1].split('"')[0].trim()
        const wurl = `https://fast.wistia.net/embed/iframe/${wvideo}`
        log("Wisitia video url is ", wurl)
        
        log("Opening embedded video from Wistia...")
        container.innerHTML += `<h3><a href="${wurl}" target="_blank">${wurl}</a></h3>`
        window.open(wurl, '_blank')
        log("WORip complete")
    }

    log('Waiting for page to load...')
    await pause(3000)
    log('Page loaded!')

    log("Injecting download button into DOM...")
    const downloadButton = document.createElement('button')
    downloadButton.innerText = "Download Video"
    downloadButton.classList.add("button")
    downloadButton.classList.add("is-transparent")
    downloadButton.style.background = "limeGreen"
    downloadButton.style.color = "#fff"
    downloadButton.addEventListener('click', downloadVideo)
    const container = document.querySelector('.header-container')
    setTimeout(() => container.appendChild(downloadButton), 1000)
})()