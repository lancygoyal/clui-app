import React from "react";
import Result from "../Result";
import DATA from "../data.json";

const { world: WORLD, ...COUNTRIES } = DATA;

export default {
  description: "See Countries",
  commands: (query) => {
    if (WORLD?.data) {
      const countries = {
        list: {
          description: `Print List`,
          run: () => <Result header="World" data={WORLD?.data} />,
        },
      };

      return WORLD.data.reduce((acc, country) => {
        const countryName = country.area;
        acc[countryName.toLowerCase()] = COUNTRIES[countryName.toLowerCase()]
          ? {
              description: `Select ${countryName} To See States`,
              commands: (stateQuery) => {
                const allState = COUNTRIES[query.toLowerCase()];
                const allStateNames = Object.keys(allState);

                if (allStateNames.length > 0) {
                  return allStateNames.reduce((acc, state) => {
                    acc[state] = {
                      description: `Select ${state.capitalize()} To See Cities`,
                      commands: (cityQuery) => {
                        const cities = allState?.[stateQuery]?.data;
                        const cityData = allState?.[stateQuery]?.city?.data;

                        const finalCity = {
                          list: {
                            description: `Print ${state.capitalize()} Cities`,
                            run: () => (
                              <Result
                                header={`${stateQuery.capitalize()}, ${query.capitalize()}`}
                                data={cities}
                              />
                            ),
                          },
                        };
                        return cities.reduce((acc, city) => {
                          acc[city.area.toLowerCase()] = {
                            description: `Select ${city.area} To See Areas`,
                            run: () => <Result data={cityData?.[cityQuery]} />,
                          };
                          return acc;
                        }, finalCity);
                      },
                    };
                    return acc;
                  }, {});
                }
              },
            }
          : {
              description: `Select ${countryName} To See States`,
              run: () => <Result />,
            };
        return acc;
      }, countries);
    }
    return {};
  },
};
