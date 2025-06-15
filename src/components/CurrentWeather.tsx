import type { GeocodingResponse, WeatherData } from "@/api/types";
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface CurrentWeatherProps {
	data: WeatherData;
	location?: GeocodingResponse;
}

const CurrentWeather = ({ data, location }: CurrentWeatherProps) => {
	const {
		weather: [currentWeather],
		main: { temp, feels_like, temp_min, temp_max, humidity },
		wind: { speed },
	} = data;

	const locationName = location?.name;
	const locationState = location?.state;
	const locationCountry = location?.country;

	const formatTemperature = (temp: number) => `${Math.round(temp)}°`;

	return (
		<Card className='overflow-hidden flex-1'>
			<CardContent className='p-6'>
				<div className='grid gap-6 md:grid-cols-2'>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<div className='flex items-end gap-1'>
								<h2 className='text-2xl font-bold tracking-tight'>
									{locationName}
								</h2>
								{locationState && (
									<span className='text-muted-foreground'>
										, {locationState}
									</span>
								)}
							</div>
							<p className='text-sm text-muted-foreground'>{locationCountry}</p>
						</div>

						<div className='flex items-center gap-2'>
							<p className='text-7xl font-bold tracking-tight'>
								{formatTemperature(temp)}
							</p>
							<div className='space-y-1'>
								<p className='text-sm font-medium text-muted-foreground'>
									Feels like {formatTemperature(feels_like)}
								</p>
								<div className='flex gap-2 text-sm font-medium'>
									<span className='flex items-center gap-1 text-blue-400'>
										<ArrowDown className='h-4 w-4' />
										{formatTemperature(temp_min)}
									</span>
									<span className='flex items-center gap-1 text-red-400'>
										<ArrowUp className='h-4 w-4' />
										{formatTemperature(temp_max)}
									</span>
								</div>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div className='flex items-center gap-2'>
								<Droplets className='h-4 w-4 text-blue-400' />
								<div className='space-y-0.5'>
									<p className='text-sm font-medium'>Humidity</p>
									<p className='text-sm text-muted-foreground'>{humidity}% </p>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Wind className='h-4 w-4 text-blue-400' />
								<div className='space-y-0.5'>
									<p className='text-sm font-medium'>Wind Speed</p>
									<p className='text-sm text-muted-foreground'>{speed} m/s</p>
								</div>
							</div>
						</div>
					</div>

					<div className='flex flex-col items-center justify-center'>
						<div className='relative flex items-center justify-center aspect-square w-full max-w-[200px]'>
							<img
								src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
								alt={currentWeather.description}
								className='w-full h-full object-contain'
							/>
							<div className='absolute bottom-0 text-center'>
								<p className='text-sm font-medium capitalize'>
									{currentWeather.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CurrentWeather;
