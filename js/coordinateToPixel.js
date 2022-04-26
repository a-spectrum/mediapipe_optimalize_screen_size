const coordinateToPixel = (landMarkCoordinate) => {
    // Landmark = x,y,z,visibility
    return {
        "x": graphicSize.width - Math.trunc(landMarkCoordinate.x * graphicSize.width),
        "y": Math.trunc(landMarkCoordinate.y * graphicSize.height),
        "z": landMarkCoordinate.z.toFixed(2),
        "visibility": landMarkCoordinate.visibility.toFixed(2)
    }
}