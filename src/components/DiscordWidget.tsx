import React from "react";
import type { DiscordData, DiscordActivity } from "../services/discordAPI";
import "../styles/DiscordWidget.css";

interface DiscordWidgetProps {
  data: DiscordData;
}

const DiscordWidget: React.FC<DiscordWidgetProps> = ({ data }) => {
  const { activities } = data;

  if (!activities || activities.length === 0) return null;

  // Filter out custom status (type === 4)
  const filteredActivities = activities.filter((act) => act.type !== 4);

  return (
    <div className="discord-widget-container">
      {filteredActivities.map((activity: DiscordActivity, idx: number) => {
        const appId = (activity as any).application_id as string | undefined;

        // Timer
        let timerText = "";
        if (activity.timestamps?.start) {
          const start = new Date(activity.timestamps.start);
          const end = activity.timestamps.end ? new Date(activity.timestamps.end) : new Date();
          const durationMs = end.getTime() - start.getTime();
          const durationMin = Math.floor(durationMs / 60000);
          timerText = `⏱ ${durationMin} min`;
        }

        return (
          <div key={idx} className="discord-activity-card">
            <div className="discord-activity-left">
              {activity.assets?.large_image && appId && (
                <img
                  className="discord-large-image"
                  src={`https://cdn.discordapp.com/app-assets/${appId}/${activity.assets.large_image}.png`}
                  alt={activity.name}
                />
              )}
              {activity.assets?.small_image && appId && (
                <img
                  className="discord-small-image-badge"
                  src={`https://cdn.discordapp.com/app-assets/${appId}/${activity.assets.small_image}.png`}
                  alt={activity.name}
                />
              )}
            </div>

            <div className="discord-activity-right">
              <span className="discord-activity-name">{activity.name}</span>
              {activity.details && (
                <span className="discord-activity-details">{activity.details}</span>
              )}
              {activity.state && (
                <span className="discord-activity-state">{activity.state}</span>
              )}
              {timerText && <span className="discord-activity-timer">{timerText}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiscordWidget;
