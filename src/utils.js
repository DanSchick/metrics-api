const isOverAnHourAgo = (timestamp) => {
    const now = new Date().getTime()
    const hour
    = 10000;
    if(now - timestamp > hour) {
        return true
    } 
    return false
}