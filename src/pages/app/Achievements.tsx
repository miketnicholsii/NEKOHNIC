import { Helmet } from "react-helmet-async";
import AchievementsBadges from "@/components/dashboard/AchievementsBadges";

export default function Achievements() {
  return (
    <>
      <Helmet>
        <title>Achievements | NÈKO</title>
        <meta name="description" content="Track your progress and earn badges as you build your business credit." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Achievements & Badges
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your progress and earn rewards as you build your business
          </p>
        </div>

        <AchievementsBadges />
      </div>
    </>
  );
}
