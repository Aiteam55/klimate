import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemperature from "@/components/HourlyTemperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useWeatherQuery, useForecastQuery } from "@/hooks/useWeather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const City = () => {
	const [searchParams] = useSearchParams();
	const params = useParams();
	const lat = parseFloat(searchParams.get("lat") || "0");
	const lon = parseFloat(searchParams.get("lon") || "0");

	const coordinates = { lat, lon };

	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);

	if (weatherQuery.error || forecastQuery.error) {
		return (
			<Alert variant='destructive'>
				<AlertTriangle className='h-4 w-4' />
				<AlertDescription>
					Failed to load weather data. Please try again.
				</AlertDescription>
			</Alert>
		);
	}

	if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
		return <WeatherSkeleton />;
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-xl font-bold tracking-tight'>
					{params.cityName}, {weatherQuery.data.sys.country}
				</h1>
				<div className='flex gap-2'>
					{/* <FavoriteButton
						data={{ ...weatherQuery.data, name: params.cityName }}
					/> */}
				</div>
			</div>

			<div className='grid gap-6'>
				<div className='grid gap-6 md:grid-cols-2'>
					<CurrentWeather data={weatherQuery.data} />
					<WeatherDetails data={weatherQuery.data} />
				</div>
				<HourlyTemperature data={forecastQuery.data} />
				<WeatherForecast data={forecastQuery.data} />
			</div>
		</div>
	);
};

export default City;
