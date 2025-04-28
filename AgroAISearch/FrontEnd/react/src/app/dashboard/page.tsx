
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
    const router = useRouter();
    const [alertMessage, setAlertMessage] = useState('');
    const [sensorData, setSensorData] = useState({
        soilMoisture: 60,
        phLevel: 6.5,
        ndvi: 0.7,
        temperature: 25,
    });

    const handleSensorDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSensorData(prevData => ({
            ...prevData,
            [name]: parseFloat(value),
        }));
    };

    const handleSubmitAlert = async (event: React.FormEvent) => {
        event.preventDefault();
        // Implement sending alert logic here (e.g., to Twilio)
        alert(`Alert message sent: ${alertMessage}`);
    };

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
                <div className="flex-1 p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dashboard Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Soil Moisture</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        type="number"
                                        name="soilMoisture"
                                        value={sensorData.soilMoisture}
                                        onChange={handleSensorDataChange}
                                    />
                                    <p>{sensorData.soilMoisture}%</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>pH Level</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        type="number"
                                        name="phLevel"
                                        value={sensorData.phLevel}
                                        onChange={handleSensorDataChange}
                                    />
                                    <p>{sensorData.phLevel}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>NDVI</CardTitle>
                                </CardHeader>
                                <CardContent>

                                    <p>{sensorData.ndvi}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Temperature</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        type="number"
                                        name="temperature"
                                        value={sensorData.temperature}
                                        onChange={handleSensorDataChange}
                                    />
                                    <p>{sensorData.temperature}°C</p>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                    <div className="mt-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">
                                    <Icons.bell className="mr-2 h-4 w-4" />
                                    Send Alert
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader>
                                    <SheetTitle>Send Alert</SheetTitle>
                                </SheetHeader>
                                <form onSubmit={handleSubmitAlert} className="flex flex-col space-y-4">
                                    <Textarea
                                        placeholder="Enter alert message..."
                                        value={alertMessage}
                                        onChange={(e) => setAlertMessage(e.target.value)}
                                    />
                                    <Button type="submit">Send Alert</Button>
                                </form>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default Dashboard;
