const GITHUB_USERNAME = "sudharaka2010";
const GITHUB_API_BASE = "https://api.github.com";
const REVALIDATE_SECONDS = 60 * 60;

type GitHubApiUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

type GitHubApiRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  pushed_at: string;
  updated_at: string;
  topics: string[];
  open_issues_count: number;
  default_branch: string;
  fork: boolean;
};

export type GitHubProfileSummary = {
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  bioLines: string[];
  publicRepos: number;
  followers: number;
  following: number;
  joinedAt: string;
  updatedAt: string;
};

export type GitHubRepoSummary = {
  id: number;
  name: string;
  url: string;
  description: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  pushedAt: string;
  updatedAt: string;
  topics: string[];
  openIssues: number;
  defaultBranch: string;
};

export type GitHubContributionCell = {
  date: string | null;
  level: number;
};

export type GitHubContributionCalendar = {
  heading: string;
  yearLabel: string;
  months: string[];
  rows: GitHubContributionCell[][];
};

export type GitHubShowcaseData = {
  profile: GitHubProfileSummary;
  repos: GitHubRepoSummary[];
  contributionCalendar: GitHubContributionCalendar;
};

function createGitHubHeaders(accept: string) {
  return {
    Accept: accept,
    "User-Agent": "sudharaka-portfolio",
  };
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    headers: createGitHubHeaders("application/vnd.github+json"),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed for ${url}`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: createGitHubHeaders("text/html,application/xhtml+xml"),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed for ${url}`);
  }

  return response.text();
}

function normalizeText(input: string) {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function mapBioLines(bio: string | null) {
  if (!bio) {
    return [];
  }

  return bio
    .split(/\r?\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function fallbackDescription(repo: GitHubApiRepo) {
  if (repo.description) {
    return repo.description;
  }

  if (repo.language) {
    return `Public ${repo.language} repository from the ${repo.default_branch} branch.`;
  }

  return "Public repository showcasing development work and source control history.";
}

function parseContributionHeading(html: string) {
  const match = html.match(
    /<h2[^>]*id="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/,
  );
  const heading = normalizeText(match?.[1] ?? "Contribution activity");
  const yearLabel = heading.match(/in\s+(\d{4})/)?.[1] ?? new Date().getFullYear().toString();

  return {
    heading,
    yearLabel,
  };
}

function parseContributionMonths(html: string) {
  return Array.from(
    html.matchAll(
      /ContributionCalendar-label[\s\S]*?<span aria-hidden="true"[^>]*>([^<]+)<\/span>/g,
    ),
  ).map((match) => normalizeText(match[1]));
}

function parseContributionRows(html: string) {
  const tbody = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? "";
  const rowMatches = Array.from(tbody.matchAll(/<tr[\s\S]*?<\/tr>/g)).map(
    (match) => match[0],
  );

  return rowMatches.map((rowHtml) => {
    const cellMatches = Array.from(rowHtml.matchAll(/<td\b[\s\S]*?<\/td>/g)).map(
      (match) => match[0],
    );

    return cellMatches.slice(1).map((cellHtml) => {
      const date = cellHtml.match(/data-date="([^"]+)"/)?.[1] ?? null;
      const levelValue = cellHtml.match(/data-level="(\d)"/)?.[1];

      return {
        date,
        level: levelValue ? Number(levelValue) : 0,
      } satisfies GitHubContributionCell;
    });
  });
}

export async function getGitHubShowcaseData(
  username = GITHUB_USERNAME,
): Promise<GitHubShowcaseData> {
  const [profile, repos, contributionHtml] = await Promise.all([
    fetchJson<GitHubApiUser>(`${GITHUB_API_BASE}/users/${username}`),
    fetchJson<GitHubApiRepo[]>(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`,
    ),
    fetchText(`https://github.com/users/${username}/contributions`),
  ]);

  const contributionHeading = parseContributionHeading(contributionHtml);
  const contributionRows = parseContributionRows(contributionHtml);

  return {
    profile: {
      username: profile.login,
      name: profile.name ?? profile.login,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
      bioLines: mapBioLines(profile.bio),
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      joinedAt: profile.created_at,
      updatedAt: profile.updated_at,
    },
    repos: repos
      .filter((repo) => !repo.fork)
      .sort(
        (left, right) =>
          new Date(right.pushed_at).getTime() - new Date(left.pushed_at).getTime(),
      )
      .slice(0, 6)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        url: repo.html_url,
        description: fallbackDescription(repo),
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        pushedAt: repo.pushed_at,
        updatedAt: repo.updated_at,
        topics: repo.topics,
        openIssues: repo.open_issues_count,
        defaultBranch: repo.default_branch,
      })),
    contributionCalendar: {
      heading: contributionHeading.heading,
      yearLabel: contributionHeading.yearLabel,
      months: parseContributionMonths(contributionHtml).slice(0, 12),
      rows: contributionRows,
    },
  };
}
