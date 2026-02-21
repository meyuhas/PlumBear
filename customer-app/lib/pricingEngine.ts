// PlumBear Dynamic Pricing Engine
// Calculates real-time pricing based on urgency, time, and zone multipliers

export interface PricingContext {
    jobType: 'leak' | 'clog' | 'water_heater' | 'installation' | 'maintenance' | 'emergency';
    urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    neighborhood: string;
    isAfterHours?: boolean;
    isWeekend?: boolean;
    isHoliday?: boolean;
}

export interface PriceBreakdown {
    basePrice: number;
    urgencySurge: number;
    timeSurge: number;
    zoneSurge: number;
    finalPrice: number;
    breakdown: string;
}

const BASE_PRICES: Record<PricingContext['jobType'], number> = {
    leak: 79.99,
    clog: 89.99,
    water_heater: 99.99,
    installation: 129.99,
    maintenance: 69.99,
    emergency: 199.99,
};

const URGENCY_MULTIPLIERS: Record<PricingContext['urgencyLevel'], number> = {
    CRITICAL: 2.0,
    HIGH: 1.5,
    MEDIUM: 1.2,
    LOW: 1.0,
};

const ZONE_MULTIPLIERS: Record<string, number> = {
    'the_heights': 1.0,
    'montrose': 1.05,
    'midtown': 1.1,
    'downtown': 1.15,
    'heights': 1.0,
};

export function calculateJobPrice(context: PricingContext): PriceBreakdown {
    const basePrice = getBasePrice(context.jobType);
    const urgencyMultiplier = calculateSurgeMultiplier(context.urgencyLevel);
    const timeMultiplier = calculateTimeMultiplier(context.isAfterHours, context.isWeekend, context.isHoliday);
    const zoneMultiplier = calculateZoneMultiplier(context.neighborhood);

  const subtotal = basePrice * urgencyMultiplier;
    const withTime = subtotal * timeMultiplier;
    const finalPrice = Math.min(Math.max(withTime * zoneMultiplier, 69.99), 299.99);

  const breakdown = `Base $${basePrice.toFixed(2)} × ${urgencyMultiplier}x (urgency) × ${timeMultiplier.toFixed(2)}x (time) × ${zoneMultiplier.toFixed(2)}x (zone) = $${finalPrice.toFixed(2)}`;

  return {
        basePrice,
        urgencySurge: urgencyMultiplier,
        timeSurge: timeMultiplier,
        zoneSurge: zoneMultiplier,
        finalPrice,
        breakdown,
  };
}

export function getBasePrice(jobType: PricingContext['jobType']): number {
    return BASE_PRICES[jobType] || 89.99;
}

export function calculateSurgeMultiplier(urgencyLevel: PricingContext['urgencyLevel']): number {
    return URGENCY_MULTIPLIERS[urgencyLevel] || 1.0;
}

export function calculateTimeMultiplier(
    isAfterHours?: boolean,
    isWeekend?: boolean,
    isHoliday?: boolean
  ): number {
    if (isHoliday) return 1.5;
    if (isWeekend) return 1.15;
    if (isAfterHours) return 1.2;
    return 1.0;
}

export function calculateZoneMultiplier(neighborhood: string): number {
    const key = neighborhood.toLowerCase().replace(/\s+/g, '_');
    return ZONE_MULTIPLIERS[key] || 1.0;
}

export function isAfterHours(date?: Date): boolean {
    const now = date || new Date();
    const hour = now.getHours();
    return hour < 8 || hour >= 18;
}

export function getEstimate(basePrice: number, urgency: PricingContext['urgencyLevel']): string {
    const multiplier = URGENCY_MULTIPLIERS[urgency];
    const estimated = basePrice * multiplier;
    return `$${estimated.toFixed(2)}`;
}

export function getPriceBreakdown(context: PricingContext): string {
    return calculateJobPrice(context).breakdown;
}
