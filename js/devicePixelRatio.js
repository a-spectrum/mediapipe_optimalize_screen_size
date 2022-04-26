const fixDevicePixelRatio = () => {
    if (window.devicePixelRatio !== 1) {
        var c = canvasElement // your canvas
        var w = c.width, h = c.height;

        console.log(w, h);

        // scale the canvas by window.devicePixelRatio
        c.setAttribute('width', w * window.devicePixelRatio);
        c.setAttribute('height', h * window.devicePixelRatio);

        // use css to bring it back to regular size
        c.setAttribute('style', 'width="' + w + '"; height="' + h + '";')

        // set the scale of the context
        c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
    }
};

fixDevicePixelRatio();