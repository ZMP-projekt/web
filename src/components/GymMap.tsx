import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

interface GymLocation {
    id: number;
    name: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
}

interface GymMapProps {
    locations: GymLocation[];
    activeIndex: number | null;
    onPinClick: (id: number) => void;
}

const createMarkerIcon = (isActive: boolean): L.DivIcon =>
    L.divIcon({
        className: "custom-div-icon",
        html: `<div class="marker-container ${isActive ? "active" : ""}">
                   <div class="marker-pin"></div>
                   <div class="marker-pulse"></div>
               </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40],
    });

export const GymMap: React.FC<GymMapProps> = ({ locations, activeIndex, onPinClick }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef   = useRef<L.Map | null>(null);
    const clusterGroupRef  = useRef<L.MarkerClusterGroup | null>(null);
    const markersMapRef    = useRef<Map<number, L.Marker>>(new Map());

    const onPinClickRef = useRef(onPinClick);
    useEffect(() => {
        onPinClickRef.current = onPinClick;
    }, [onPinClick]);

    useEffect(() => {
        if (!mapContainerRef.current || locations.length === 0) return;

        if (!mapInstanceRef.current) {
            const avgLat = locations.reduce((s, l) => s + l.latitude,  0) / locations.length;
            const avgLng = locations.reduce((s, l) => s + l.longitude, 0) / locations.length;

            mapInstanceRef.current = L.map(mapContainerRef.current, {
                center: [avgLat, avgLng],
                zoom: 6,
                zoomControl: false,
            });

            L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
                attribution: "&copy; CARTO",
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            L.control.zoom({ position: "bottomright" }).addTo(mapInstanceRef.current);
        }

        const map = mapInstanceRef.current;

        if (clusterGroupRef.current) {
            map.removeLayer(clusterGroupRef.current);
        }

        const clusters = L.markerClusterGroup({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 50,
        });

        markersMapRef.current.clear();

        locations.forEach((loc) => {
            const marker = L.marker([loc.latitude, loc.longitude], {
                icon: createMarkerIcon(false),
            }).bindPopup(
                `<div class="map-popup"><strong>${loc.name}</strong><br/><span>${loc.address}, ${loc.city}</span></div>`,
                { closeButton: false }
            );

            marker.on("click", () => onPinClickRef.current(loc.id));
            clusters.addLayer(marker);
            markersMapRef.current.set(loc.id, marker);
        });

        map.addLayer(clusters);
        clusterGroupRef.current = clusters;

    }, [locations]);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        markersMapRef.current.forEach((marker, id) => {
            marker.setIcon(createMarkerIcon(id === activeIndex));
        });

        if (activeIndex !== null) {
            const target = markersMapRef.current.get(activeIndex);
            if (target) {
                map.flyTo(target.getLatLng(), 16, { animate: true });
                map.once('zoomend', function () {
                    target.openPopup();
                });
            }
        }
    }, [activeIndex]);

    useEffect(() => {
        const markersRef = markersMapRef.current;
        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current   = null;
            clusterGroupRef.current  = null;
            markersRef.clear();
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            <style>{`
                .marker-container { position: relative; width: 30px; height: 30px; }

                .marker-pin {
                    width: 20px; height: 20px;
                    background: #3B82F6; border: 3px solid #fff;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg); margin: 5px;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 10px rgba(59,130,246,0.5);
                }
                .marker-container.active .marker-pin {
                    background: #8B5CF6;
                    transform: rotate(-45deg) scale(1.3);
                }
                .marker-pulse {
                    position: absolute; top: 15px; left: 15px;
                    width: 10px; height: 10px;
                    background: rgba(59,130,246,0.4); border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: pulse 2s infinite; z-index: -1;
                }
                @keyframes pulse {
                    0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
                }
                .map-popup { font-family: 'Outfit', sans-serif; color: #1E293B; }

                .marker-cluster-small,
                .marker-cluster-medium,
                .marker-cluster-large { background-color: rgba(59,130,246,0.2) !important; }

                .marker-cluster-small div,
                .marker-cluster-medium div,
                .marker-cluster-large div {
                    background-color: rgba(59,130,246,0.85) !important;
                    color: white !important; font-weight: bold;
                }
            `}</style>
            <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
    );
};