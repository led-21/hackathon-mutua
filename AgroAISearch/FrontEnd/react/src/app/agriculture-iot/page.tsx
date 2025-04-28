'use client';

import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { FaTemperatureHigh, FaTint, FaLeaf, FaChartLine } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


type SensorData = {
    id: string;
    position: {
        lat: number;
        lng: number;
    };
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lastUpdated: string;
    cropType: string;
};

export default function AgricultureIoT() {
    const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
    const [showCharts, setShowCharts] = useState(false);
    const router = useRouter();

    // Dados simulados de sensores IoT
    const sensorData: SensorData[] = [
        {
            id: 'sensor-1',
            position: { lat: -22.1234, lng: -45.5678 },
            temperature: 25.4,
            humidity: 65,
            soilMoisture: 42,
            lastUpdated: '2023-05-15T10:30:00',
            cropType: 'Soy'
        },
        {
            id: 'sensor-2',
            position: { lat: -22.1256, lng: -45.5723 },
            temperature: 23.8,
            humidity: 72,
            soilMoisture: 38,
            lastUpdated: '2023-05-15T10:32:00',
            cropType: 'Corn'
        },
        {
            id: 'sensor-3',
            position: { lat: -22.1198, lng: -45.5691 },
            temperature: 26.1,
            humidity: 68,
            soilMoisture: 45,
            lastUpdated: '2023-05-15T10:35:00',
            cropType: 'Pasture'
        }
    ];

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'api-key'
    });

    const mapCenter = useMemo(() => ({ lat: -22.1234, lng: -45.5678 }), []);

    const onLoad = useCallback((map: google.maps.Map) => {
        // Para ajustes adicionais no mapa, se necessário
    }, []);

    if (!isLoaded) return <div>Carregando mapa...</div>;

    return (

        <SidebarProvider>
            <div className="flex h-screen bg-gray-100">
                <Sidebar collapsible="icon">
                    <SidebarHeader>
                        <CardTitle>FieldGuard AI</CardTitle>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Features</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => router.push('/dashboard')}>
                                        <Icons.home className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <Icons.wateringCan className="mr-2 h-4 w-4" />
                                        <span>Precision Agriculture</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <Icons.shield className="mr-2 h-4 w-4" />
                                        <span>Agents AI</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => router.push('/agriculture-iot')}>
                                        <Icons.map className="mr-2 h-4 w-4" />
                                        <span>Geospatial Data</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel>Settings</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <Icons.settings className="mr-2 h-4 w-4" />
                                        <span>Account Settings</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <Icons.help className="mr-2 h-4 w-4" />
                                        <span>Help & Support</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <div className="p-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-full rounded-md p-2">
                                        <Avatar className="mr-2 h-6 w-6">
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        <span>Account</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/')}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </SidebarFooter>
                </Sidebar>
            </div>

            <div className="flex-1 flex flex-col p-4 bg-gray-50">
                <header className="bg-green-700 text-white p-4 rounded">
                    <h1 className="text-2xl font-bold">Agriculture with IoT - Real-Time Monitoring</h1>
                </header>
                <div className="flex flex-1 mt-4 gap-4 overflow-hidden">
                    <aside className="w-64 bg-gray-100 p-4 rounded h-full">
                        <h2 className="text-xl font-semibold mb-4">Sensors</h2>
                        <ul className="space-y-2">
                            {sensorData.map((sensor) => (
                                <li
                                    key={sensor.id}
                                    className="p-2 hover:bg-green-200 cursor-pointer rounded"
                                    onClick={() => setSelectedSensor(sensor)}
                                >
                                    <div className="flex items-center">
                                        <FaLeaf className="text-green-600 mr-2" />
                                        <span>{sensor.id}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">{sensor.cropType}</div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <button
                                onClick={() => setShowCharts(!showCharts)}
                                className="bg-green-600 text-white px-4 py-2 rounded flex items-center w-full justify-center"
                            >
                                <FaChartLine className="mr-2" />
                                {showCharts ? 'Hide Charts' : 'Show Charts'}
                            </button>
                        </div>
                    </aside>
                    <main className="flex-1 relative h-[calc(100vh-64px-2rem)] rounded overflow-hidden">
                        <GoogleMap
                            mapContainerClassName="w-full h-full"
                            center={mapCenter}
                            zoom={15}
                            onLoad={onLoad}
                            options={{
                                mapTypeControl: true,
                                streetViewControl: false,
                                fullscreenControl: true,
                                styles: [
                                    {
                                        featureType: "poi",
                                        elementType: "labels",
                                        stylers: [{ visibility: "off" }]
                                    }
                                ]
                            }}
                        >
                            {sensorData.map((sensor) => (
                                <Marker
                                    key={sensor.id}
                                    position={sensor.position}
                                    icon={{
                                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${selectedSensor?.id === sensor.id ? '#FF0000' : '#34D399'}" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
                                        )}`,
                                        scaledSize: new window.google.maps.Size(30, 30)
                                    }}
                                    onClick={() => setSelectedSensor(sensor)}
                                />
                            ))}

                            {selectedSensor && (
                                <InfoWindow
                                    position={selectedSensor.position}
                                    onCloseClick={() => setSelectedSensor(null)}
                                >
                                    <div className="p-2">
                                        <h3 className="font-bold text-lg">{selectedSensor.id}</h3>
                                        <p className="text-gray-600">{selectedSensor.cropType}</p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center">
                                                <FaTemperatureHigh className="text-red-500 mr-2" />
                                                <span>Temperature: {selectedSensor.temperature}ºC</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaTint className="text-blue-500 mr-2" />
                                                <span>Humidity: {selectedSensor.humidity}%</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaTint className="text-green-700 mr-2" />
                                                <span>Soil Moisture: {selectedSensor.soilMoisture}%</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Updated: {new Date(selectedSensor.lastUpdated).toLocaleString()}
                                        </p>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>

                        {showCharts && (
                            <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
                                <h3 className="font-bold mb-2">Sensor Data</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-3 rounded">
                                        <h4 className="font-semibold text-blue-700">Temperature (ºC)</h4>
                                        <div className="h-32 bg-white mt-2 border border-blue-200">
                                            {/* Aqui iria um grafico real com uma biblioteca como Chart.js */}
                                            <div className="flex items-end h-full">
                                                {sensorData.map((sensor, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex-1 bg-blue-400 mx-0.5"
                                                        style={{ height: `${(sensor.temperature / 40) * 100}%` }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded">
                                        <h4 className="font-semibold text-green-700">Soil Moisture (%)</h4>
                                        <div className="h-32 bg-white mt-2 border border-green-200">
                                            <div className="flex items-end h-full">
                                                {sensorData.map((sensor, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex-1 bg-green-400 mx-0.5"
                                                        style={{ height: `${sensor.soilMoisture}%` }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded">
                                        <h4 className="font-semibold text-purple-700">Air Humidity (%)</h4>
                                        <div className="h-32 bg-white mt-2 border border-purple-200">
                                            <div className="flex items-end h-full">
                                                {sensorData.map((sensor, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex-1 bg-purple-400 mx-0.5"
                                                        style={{ height: `${sensor.humidity}%` }}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
