import { SessionStats } from "@/types";

export function StatsText({stats}: {stats:SessionStats}) {
  const peak = Math.max(...stats.minuteByMinuteData.map((d) => d.uhh));

  const worst =
    1 +
    stats.minuteByMinuteData.reduce(
      (worst, current, idx) =>
        current.uhh > stats.minuteByMinuteData[worst].uhh ? idx : worst,
      0
    );

  return (
    <>
      {stats.totalUhh > 0 && stats.minuteByMinuteData.length > 0 ? (
        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>
              <b>Peak of {peak} uhhs</b> in minute <b>{worst}</b> /{" "}
              {stats.minuteByMinuteData.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              <b>
                {stats.minuteByMinuteData.filter((d) => d.uhh === 0).length}{" "}
                clean minutes
              </b>{" "}
              without uhh
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-lg">
          <span className="text-2xl">🎉</span>
          <span className="font-medium bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Zero uhhh!
          </span>
        </div>
      )}
    </>
  );
}
