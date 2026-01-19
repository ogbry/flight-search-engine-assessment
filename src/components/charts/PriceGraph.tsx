import { useRecoilValue } from 'recoil';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import {
  priceDistributionSelector,
  priceStatsSelector,
  filterStateAtom,
} from '../../atoms/flightAtoms';
import { formatPrice } from '../../utils/formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      range: string;
      count: number;
      price: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-xs sm:text-sm font-medium text-gray-900">{data.range}</p>
        <p className="text-xs sm:text-sm text-gray-600">
          {data.count} {data.count === 1 ? 'flight' : 'flights'}
        </p>
      </div>
    );
  }
  return null;
}

export function PriceGraph() {
  const priceDistribution = useRecoilValue(priceDistributionSelector);
  const priceStats = useRecoilValue(priceStatsSelector);
  const filters = useRecoilValue(filterStateAtom);

  if (priceDistribution.length === 0 || priceStats.count === 0) {
    return (
      <div className="card p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-4">
          Price Distribution
        </h3>
        <div className="h-32 sm:h-48 flex items-center justify-center text-gray-400 text-sm">
          No price data available
        </div>
      </div>
    );
  }

  // Determine price trend indicator
  const midPrice = (priceStats.min + priceStats.max) / 2;
  const avgVsMid = priceStats.avg - midPrice;
  const trendPercentage = Math.abs((avgVsMid / midPrice) * 100);

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-4">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
            Price Distribution
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
            {priceStats.count} flights in view
          </p>
        </div>
        <div className="sm:text-right">
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            {avgVsMid < -10 ? (
              <>
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  {trendPercentage.toFixed(0)}% below avg
                </span>
              </>
            ) : avgVsMid > 10 ? (
              <>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                <span className="text-orange-600 font-medium">
                  {trendPercentage.toFixed(0)}% above avg
                </span>
              </>
            ) : (
              <>
                <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-gray-500 font-medium">Average prices</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
          <p className="text-[10px] sm:text-xs text-green-600 mb-0.5 sm:mb-1">Lowest</p>
          <p className="text-sm sm:text-lg font-bold text-green-700">
            {formatPrice(priceStats.min)}
          </p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
          <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Average</p>
          <p className="text-sm sm:text-lg font-bold text-gray-700">
            {formatPrice(priceStats.avg)}
          </p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg">
          <p className="text-[10px] sm:text-xs text-orange-600 mb-0.5 sm:mb-1">Highest</p>
          <p className="text-sm sm:text-lg font-bold text-orange-700">
            {formatPrice(priceStats.max)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={priceDistribution}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="price"
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 9, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              width={25}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={priceStats.avg}
              stroke="#6b7280"
              strokeDasharray="5 5"
            />
            {/* Highlight selected price range */}
            {(filters.priceRange[0] > priceStats.min ||
              filters.priceRange[1] < priceStats.max) && (
              <>
                <ReferenceLine
                  x={filters.priceRange[0]}
                  stroke="#2563eb"
                  strokeWidth={2}
                />
                <ReferenceLine
                  x={filters.priceRange[1]}
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </>
            )}
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#priceGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-500 rounded" />
          <span>Flights by price</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 sm:w-3 h-px bg-gray-400 border-t border-dashed" />
          <span>Avg price</span>
        </div>
      </div>
    </div>
  );
}
