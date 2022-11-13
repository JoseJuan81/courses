# Ejercicio $lookup
Which alliance from air_alliances flies the most routes with either a Boeing 747 or an Airbus A380 (abbreviated 747 and 380 in air_routes)?


```bash
db.air_routes.aggregate([
	{
		$match: {
			airplane: /747|380/
		}
	},
	{
		$lookup: {
			from: "air_alliances",
			foreignField: "airlines",
			localField: "airline.name",
			as: "alliance"
		}
	},
	{
		$unwind: "$alliance"
	},
	{
		$group: {
			_id: "$alliance.name",
			count: { $sum: 1 }
		}
	},
	{
		$sort: { count: -1 }
	}
])
```