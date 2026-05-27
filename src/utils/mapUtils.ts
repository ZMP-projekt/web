export const calculateMapCenter = (locations: { latitude: number, longitude: number }[]) => {
    if (!locations || locations.length === 0) {
        return { lat: 0, lng: 0 };
    }
    const lat = locations.reduce((s, l) => s + l.latitude, 0) / locations.length;
    const lng = locations.reduce((s, l) => s + l.longitude, 0) / locations.length;

    return { lat, lng };
};