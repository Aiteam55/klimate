import { Search, Loader2 } from "lucide-react";
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

const CitySearch = () => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const { data: locations, isLoading } = useLocationSearch(query);

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
		setOpen(false);
		setQuery("");
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

					<CommandSeparator />

					<CommandGroup heading='Recent Searches'>
						<CommandItem>Recent Searches</CommandItem>
					</CommandGroup>

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
