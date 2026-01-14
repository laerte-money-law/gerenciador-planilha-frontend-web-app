const DEFAULT_TOP = 50;

export class DepositGuideFilter {
    search?: string;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    guideDateFrom?: Date;
    guideDateTo?: Date;
    minValue?: string;
    maxValue?: string;
    top?: number;

    public static getFiltersOrDefault(filter?: DepositGuideFilter | null): DepositGuideFilter {
        if (!filter) {
            return { top: DEFAULT_TOP };
        }

        const hasNoFilters = Object.entries(filter)
            .filter(([key]) => key !== "top") // ignora top
            .every(
                ([, value]) =>
                    value === null || value === undefined || (typeof value === "string" && value.trim() === "")
            );

        if (hasNoFilters && (filter.top === null || filter.top === undefined)) {
            return { ...filter, top: DEFAULT_TOP };
        }

        return filter;
    }

    public static buildQueryString(inputFilters: DepositGuideFilter): string {
        const params = new URLSearchParams();

        const filter = DepositGuideFilter.getFiltersOrDefault(inputFilters);

        if (!filter) {
            params.append("top", DEFAULT_TOP.toString());
            return "?" + params.toString();
        }

        if (filter.search !== undefined && filter.search.trim() !== "") {
            console.log("Search term:", filter.search);
            params.append("search", filter.search.trim());
        }

        if (filter.dueDateFrom) {
            params.append("dueDateFrom", filter.dueDateFrom.toISOString());
        }

        if (filter.dueDateTo) {
            params.append("dueDateTo", filter.dueDateTo.toISOString());
        }

        if (filter.guideDateFrom) {
            params.append("guideDateFrom", filter.guideDateFrom.toISOString());
        }

        if (filter.guideDateTo) {
            params.append("guideDateTo", filter.guideDateTo.toISOString());
        }

        if (filter.minValue) {
            params.append("minValue", filter.minValue);
        }

        if (filter.maxValue) {
            params.append("maxValue", filter.maxValue);
        }

        if (filter.top !== undefined) {
            params.append("top", filter.top.toString());
        }

        return "?" + params.toString();
    }


}
