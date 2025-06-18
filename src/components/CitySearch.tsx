import { Search, Loader2, XCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { useLocationSearch } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSerachHistory";
import { format } from "date-fns";

const CitySearch = () => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const navigate = useNavigate();
	const { data: locations, isLoading } = useLocationSearch(query);
	const { history, clearHistory, addToHistory } = useSearchHistory();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const handleSelect = (cityData: string) => {
		const [lat, lon, name, country] = cityData.split("|");

		addToHistory.mutate({
			query,
			name,
			lat: parseFloat(lat),
			lon: parseFloat(lon),
			country,
		});

		setOpen(false);
		navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
	};

	return (
		<>
			<Button
				variant={"outline"}
				className='relative w-full text-sm text-muted-foreground md:w-40 lg:w-64'
				onClick={() => setOpen(true)}>
				<div className='flex w-full justify-between'>
					<div className='flex items-center justify-center'>
						<Search className='mr-2 h-4 w-4' />
						Search Cities ...
					</div>
					<div className='flex gap-0.5 items-center justify-center'>
						<span className='text-xs'>⌘</span>K
					</div>
				</div>
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}>
				<CommandInput
					placeholder='Search a City ...'
					value={query}
					onValueChange={setQuery}
				/>
				<CommandList>
					{query.length > 2 && !isLoading && (
						<CommandEmpty>No City found.</CommandEmpty>
					)}

					<CommandGroup heading='Favorites'>
						<CommandItem>Favorites</CommandItem>
					</CommandGroup>

					{history.length > 0 && (
						<>
							<CommandSeparator />
							<CommandGroup heading='Recent Searches'>
								<div className='flex items-center justify-between px-2 my-2'>
									<p className='text-xs text-muted-foreground'>
										Recent Searches
									</p>
									<Button
										variant={"ghost"}
										size={"sm"}
										onClick={() => clearHistory.mutate()}>
										<XCircle className='h-3 w-3' />
										Clear
									</Button>
								</div>
								{history.map((location) => {
									return (
										<CommandItem
											key={`${location.lat}-${location.lon}`}
											value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
											onSelect={handleSelect}>
											<Clock className='mr-2 h-4 w-4' />
											<span>{location.name}</span>
											{location.state && (
												<span className='text-sm text-muted-foreground'>
													, {location.state}
												</span>
											)}
											<span className='text-sm text-muted-foreground'>
												, {location.country}
											</span>
											<span className='ml-auto text-xs text-muted-foreground'>
												{format(location.searchedAt, "MMM d, h:mm a")}
											</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
						</>
					)}

					<CommandSeparator />

					{locations && locations.length > 0 && (
						<CommandGroup heading='Suggestions'>
							{isLoading && (
								<div className='flex items-center justify-center p-4'>
									<Loader2 className='h-4 w-4 animate-spin' />
								</div>
							)}
							{locations?.map((location) => (
								<CommandItem
									key={`${location.lat}-${location.lon}`}
									value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
									onSelect={handleSelect}>
									<Search className='mr-2 h-4 w-4' />
									<span>{location.name}</span>
									{location.state && (
										<span className='text-sm text-muted-foreground'>
											, {location.state}
										</span>
									)}
									<span className='text-sm text-muted-foreground'>
										, {location.country}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default CitySearch;
