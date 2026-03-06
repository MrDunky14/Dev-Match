// Dating-style Matching Algorithm for CollabNest
// Inspired by Tinder/Hinge ELO-based matching — matches are NOT guaranteed every swipe
// They happen probabilistically based on mutual interest simulation

import { User, Match } from './types';

// ─────────────────────────────────────────────
// SCORE CALCULATION
// ─────────────────────────────────────────────

/** Calculate shared skills between two users */
export function getSkillOverlap(a: User, b: User): string[] {
    return a.skills.filter(s => b.skills.includes(s));
}

/** Calculate complementary skills (what b has that a doesn't) */
export function getComplementarySkills(a: User, b: User): string[] {
    return b.skills.filter(s => !a.skills.includes(s)).slice(0, 4);
}

/** Calculate shared interests */
export function getInterestOverlap(a: User, b: User): string[] {
    return a.interests.filter(i => b.interests.includes(i));
}

/** Experience compatibility score (0–25) */
function experienceScore(a: User, b: User): number {
    const levels = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    const diff = Math.abs(levels[a.experience] - levels[b.experience]);
    if (diff === 0) return 25;
    if (diff === 1) return 15;
    return 5;
}

/** Availability compatibility score (0–20) */
function availabilityScore(a: User, b: User): number {
    if (a.availability === b.availability) return 20;
    if (
        (a.availability === 'Full-time' && b.availability === 'Part-time') ||
        (a.availability === 'Part-time' && b.availability === 'Full-time')
    ) return 12;
    return 6;
}

/** Skill overlap score (0–35) */
function skillScore(a: User, b: User): number {
    const overlap = getSkillOverlap(a, b).length;
    const complementary = getComplementarySkills(a, b).length;
    // Overlap adds value, complementary adds MORE value (you fill each other's gaps)
    const raw = overlap * 4 + complementary * 5;
    return Math.min(35, raw);
}

/** Interest score (0–20) */
function interestScore(a: User, b: User): number {
    const overlap = getInterestOverlap(a, b).length;
    return Math.min(20, overlap * 7);
}

/**
 * Compute a raw compatibility score (0–100) between two users
 * based on skills, interests, experience, and availability.
 */
export function computeCompatibility(a: User, b: User): number {
    const score =
        skillScore(a, b) +
        interestScore(a, b) +
        experienceScore(a, b) +
        availabilityScore(a, b);
    return Math.min(100, Math.round(score));
}

// ─────────────────────────────────────────────
// DATING-STYLE: MUTUAL INTEREST SIMULATION
// ─────────────────────────────────────────────

/**
 * Simulate whether the OTHER person "likes" you back.
 * Like dating apps — not every right swipe is a match.
 * 
 * New "Rarity" formula:
 *   P(match) = 0.12 + (compatibility / 100) * 0.38 + random_noise
 * 
 * This means:
 *   - Score 50% → ~31% chance (Rare)
 *   - Score 80% → ~42% chance (Uncommon)
 *   - Score 95% → ~48% chance (Coin flip for best matches)
 */
export function simulateMutualLike(compatibilityScore: number): boolean {
    const baseProbability = 0.12;
    const skillBonus = (compatibilityScore / 100) * 0.38;
    const randomNoise = (Math.random() - 0.5) * 0.20; // Increased to ±10% noise
    const probability = Math.max(0.05, Math.min(0.65, baseProbability + skillBonus + randomNoise));
    return Math.random() < probability;
}

// ─────────────────────────────────────────────
// GENERATE SORTED + SHUFFLED MATCH QUEUE
// ─────────────────────────────────────────────

/**
 * Generate a discovery queue for the current user.
 * Uses a weighted shuffle so higher-compatibility users appear more often
 * but aren't always first (adds surprise factor like dating apps).
 */
export function generateMatches(currentUser: User, allUsers: User[]): Match[] {
    const candidates = allUsers.filter(u => u.id !== currentUser.id);

    const scored: Match[] = candidates.map(user => {
        const score = computeCompatibility(currentUser, user);
        const skillOverlap = getSkillOverlap(currentUser, user);
        const complementarySkills = getComplementarySkills(currentUser, user);

        const explanation = buildExplanation(currentUser, user, score, skillOverlap, complementarySkills);

        return {
            id: user.id,
            user,
            compatibilityScore: score,
            explanation,
            skillOverlap,
            complementarySkills,
        };
    });

    // Weighted shuffle: higher scores bubble up but with randomness
    return weightedShuffle(scored);
}

/**
 * Weighted shuffle — higher-scored items are more likely to appear
 * earlier in the queue, but there's always randomness.
 */
function weightedShuffle(matches: Match[]): Match[] {
    return matches
        .map(m => ({
            match: m,
            sortKey: m.compatibilityScore + Math.random() * 50, // Increased randomness window from 30 to 50
        }))
        .sort((a, b) => b.sortKey - a.sortKey)
        .map(item => item.match);
}

// ─────────────────────────────────────────────
// EXPLANATION GENERATOR
// ─────────────────────────────────────────────

function buildExplanation(
    a: User,
    b: User,
    score: number,
    skillOverlap: string[],
    complementary: string[]
): string {
    if (score >= 80) {
        return `You and ${b.name} are a stellar team match! You share ${skillOverlap.length} core skills and ${b.name} brings ${complementary.slice(0, 2).join(' & ')} to complement your stack.`;
    }
    if (score >= 60) {
        return `Strong match! ${b.name} shares your passion for ${getInterestOverlap(a, b)[0] || 'building products'} and your combined skills cover the full stack.`;
    }
    if (score >= 40) {
        return `${b.name} has a different but complementary skillset — together you'd fill important gaps on any team.`;
    }
    return `${b.name} could be a wild card match — different background, fresh perspective, and new skills to learn from each other.`;
}
