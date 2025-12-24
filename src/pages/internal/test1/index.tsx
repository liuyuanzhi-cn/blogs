import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// 定义数据结构接口
interface Activity {
  timeRange: string;
  description: string;
  isHighlight?: boolean;
  isSleep?: boolean;
}

interface DaySchedule {
  id: string;
  title: string;
  activities: Activity[];
}

// 独立的日程数据配置
const SCHEDULE_DATA: Record<string, DaySchedule> = {
  weekday: {
    id: 'weekday',
    title: '周一至周四',
    activities: [
      { timeRange: '06:15-07:45', description: '家务（洗漱、早饭、中饭）' },
      { timeRange: '07:45-08:05', description: '去往公司' },
      { timeRange: '08:05-09:20', description: '研习时光（学习和记忆面试知识点）', isHighlight: true },
      { timeRange: '09:20-11:50', description: '上班' },
      { timeRange: '11:50-12:50', description: '读书和记录' },
      { timeRange: '12:50-13:30', description: '午饭、散步、锻炼' },
      { timeRange: '13:30-14:10', description: '午休' },
      { timeRange: '14:10-17:10', description: '上班' },
      { timeRange: '17:10-18:10', description: '做算法题', isHighlight: true },
      { timeRange: '18:10-18:50', description: '返回家里、购买生活物品、拿快递' },
      { timeRange: '18:50-22:00', description: '做晚饭、收拾屋子、陪伴家人、洗漱' },
      { timeRange: '22:00-06:15', description: '8小时睡眠', isSleep: true }
    ]
  },
  friday: {
    id: 'friday',
    title: '周五',
    activities: [
      { timeRange: '06:15-07:45', description: '家务（洗漱、早饭、中饭）' },
      { timeRange: '07:45-08:05', description: '去往公司' },
      { timeRange: '08:05-09:20', description: '研习时光（学习和记忆面试知识点）', isHighlight: true },
      { timeRange: '09:20-11:50', description: '上班' },
      { timeRange: '11:50-12:50', description: '读书和记录' },
      { timeRange: '12:50-13:30', description: '午饭、散步、锻炼' },
      { timeRange: '13:30-14:10', description: '午休' },
      { timeRange: '14:10-16:30', description: '做算法题和总结', isHighlight: true },
      { timeRange: '16:30-17:30', description: '自由支配时间', isHighlight: true },
      { timeRange: '17:30-18:00', description: '返回家里、购买生活物品、拿快递' },
      { timeRange: '18:00-22:00', description: '做晚饭、收拾屋子、陪伴家人、洗漱' },
      { timeRange: '22:00-06:15', description: '8小时睡眠', isSleep: true }
    ]
  },
  weekend: {
    id: 'weekend',
    title: '周末',
    activities: [
      { timeRange: '06:15-08:45', description: '读书、学习等', isHighlight: true },
      { timeRange: '08:45-22:00', description: '一日三餐，做包子、零食等，外出，陪伴家人等' },
      { timeRange: '22:00-06:15', description: '8小时睡眠', isSleep: true }
    ]
  }
};

// 定义样式接口
interface ScheduleStyles {
  container: React.CSSProperties;
  header: React.CSSProperties;
  navTabs: React.CSSProperties;
  tabBtn: React.CSSProperties;
  activeTabBtn: React.CSSProperties;
  scheduleTable: React.CSSProperties;
  activeTable: React.CSSProperties;
  table: React.CSSProperties;
  th: React.CSSProperties;
  evenRow: React.CSSProperties;
  td: React.CSSProperties;
  timeCol: React.CSSProperties;
  activityCol: React.CSSProperties;
  highlight: React.CSSProperties;
  currentActivity: React.CSSProperties;
  sleepRow: React.CSSProperties;
}

const Schedule: React.FC = () => {
  return (
    <BrowserOnly>
      {() => {
        const styles: ScheduleStyles = {
          container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
          },
          header: {
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '30px',
            fontSize: '2em'
          },
          navTabs: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            gap: '10px',
            flexWrap: 'wrap'
          },
          tabBtn: {
            padding: '12px 24px',
            background: '#fff',
            border: '2px solid #3498db',
            color: '#3498db',
            cursor: 'pointer',
            borderRadius: '25px',
            transition: 'all 0.3s',
            fontWeight: 'bold',
            fontSize: '1em'
          },
          activeTabBtn: {
            background: '#3498db',
            color: 'white'
          },
          scheduleTable: {
            background: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            display: 'none'
          },
          activeTable: {
            display: 'block'
          },
          table: {
            width: '100%',
            borderCollapse: 'collapse'
          },
          th: {
            background: '#34495e',
            color: 'white',
            padding: '15px',
            textAlign: 'left',
            fontSize: '1.1em'
          },
          evenRow: {
            background: '#f8f9fa'
          },
          td: {
            padding: '15px',
            borderBottom: '1px solid #eee',
            verticalAlign: 'top'
          },
          timeCol: {
            width: '20%',
            fontWeight: 'bold',
            color: '#2c3e50'
          },
          activityCol: {
            width: '80%',
            lineHeight: '1.6'
          },
          highlight: {
            background: '#e8f4fd'
          },
          currentActivity: {
            background: '#d4edff',
            borderLeft: '4px solid #3498db'
          },
          sleepRow: {
            background: '#ecf0f1'
          }
        };

        const ScheduleComponent: React.FC = () => {
          const [currentTime, setCurrentTime] = useState<string>('');
          const [activeTab, setActiveTab] = useState<string>('weekday');

          // 解析时间范围，返回开始和结束时间的分钟数
          const parseTimeRange = (timeRange: string): { start: number; end: number } | null => {
            const [startStr, endStr] = timeRange.split('-');
            if (!startStr || !endStr) return null;

            const timeToMinutes = (timeStr: string): number => {
              // 处理跨日时间格式（如 "06:15"）
              const cleanTimeStr = timeStr.includes(':') ? timeStr : `${timeStr}:00`;
              const [hours, minutes] = cleanTimeStr.split(':').map(num => parseInt(num, 10));
              return hours * 60 + (isNaN(minutes) ? 0 : minutes);
            };

            const start = timeToMinutes(startStr);
            let end = timeToMinutes(endStr);

            // 处理跨日时间段（如22:00-06:15）
            if (end < start) {
              end += 24 * 60; // 加上一天的分钟数
            }

            return { start, end };
          };

          // 检查当前时间是否在某个活动时间段内
          const isCurrentActivity = (timeRange: string): boolean => {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTotalMinutes = currentHours * 60 + currentMinutes;
            
            const parsed = parseTimeRange(timeRange);
            if (!parsed) return false;

            return currentTotalMinutes >= parsed.start && currentTotalMinutes < parsed.end;
          };

          // 获取当前应该显示的日程表ID
          const getCurrentScheduleId = (): string => {
            const now = new Date();
            const dayOfWeek = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
            
            if (dayOfWeek === 5) return 'friday'; // 周五
            if (dayOfWeek === 0 || dayOfWeek === 6) return 'weekend'; // 周末
            return 'weekday'; // 周一至周四
          };

          // 显示当前时间
          useEffect(() => {
            const updateCurrentTime = () => {
              const now = new Date();
              const options: Intl.DateTimeFormatOptions = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long',
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false
              };
              setCurrentTime(now.toLocaleString('zh-CN', options));
            };

            updateCurrentTime();
            const timeInterval = setInterval(updateCurrentTime, 1000);
            
            return () => clearInterval(timeInterval);
          }, []);

          // 高亮当前活动并处理自动切换
          useEffect(() => {
            const highlightAndSwitch = () => {
              // 清除所有当前活动高亮
              document.querySelectorAll('tr.current-activity').forEach(row => {
                row.classList.remove('current-activity');
              });

              // 自动切换标签页
              const currentScheduleId = getCurrentScheduleId();
              if (currentScheduleId !== activeTab) {
                setActiveTab(currentScheduleId);
              }

              // 高亮当前活动
              const activeSchedule = SCHEDULE_DATA[currentScheduleId];
              if (activeSchedule) {
                const table = document.getElementById(activeSchedule.id);
                if (table) {
                  const rows = table.querySelectorAll('tbody tr');
                  rows.forEach((row, index) => {
                    if (index < activeSchedule.activities.length) {
                      const activity = activeSchedule.activities[index];
                      if (isCurrentActivity(activity.timeRange)) {
                        row.classList.add('current-activity');
                      }
                    }
                  });
                }
              }
            };

            highlightAndSwitch();
            const activityInterval = setInterval(highlightAndSwitch, 60000); // 每分钟检查一次

            return () => clearInterval(activityInterval);
          }, [activeTab]);

          // 切换标签页
          const handleTabClick = (tabId: string) => {
            setActiveTab(tabId);
            
            // 更新按钮样式
            document.querySelectorAll('.tab-btn').forEach(btn => {
              const element = btn as HTMLElement;
              if (element.dataset.type === tabId) {
                element.style.background = styles.activeTabBtn.background as string;
                element.style.color = styles.activeTabBtn.color as string;
              } else {
                element.style.background = styles.tabBtn.background as string;
                element.style.color = styles.tabBtn.color as string;
              }
            });

            // 显示对应表格
            document.querySelectorAll('.schedule-table').forEach(table => {
              const element = table as HTMLElement;
              element.style.display = element.id === tabId ? 'block' : 'none';
            });
          };

          // 渲染活动行
          const renderActivityRow = (activity: Activity, index: number, isEven: boolean) => {
            const rowStyle: React.CSSProperties = {
              ...styles.td,
              backgroundColor: isEven ? styles.evenRow.backgroundColor : undefined
            };

            if (activity.isHighlight) {
              Object.assign(rowStyle, styles.highlight);
            }

            if (activity.isSleep) {
              Object.assign(rowStyle, styles.sleepRow);
            }

            const [startTime] = activity.timeRange.split('-');
            const parsedTime = parseTimeRange(activity.timeRange);
            if (parsedTime && isCurrentActivity(activity.timeRange)) {
              Object.assign(rowStyle, styles.currentActivity);
            }

            return (
              <tr 
                key={`${activity.timeRange}-${index}`}
                data-start={startTime}
                data-end={activity.timeRange.split('-')[1]}
                style={rowStyle}
              >
                <td style={styles.timeCol}>{activity.timeRange}</td>
                <td style={styles.activityCol}>{activity.description}</td>
              </tr>
            );
          };

          return (
            <div style={styles.container}>
              <h1 style={styles.header}>📅 个人日程表</h1>
              <div style={{textAlign: 'center', marginBottom: '20px', fontSize: '1.2em'}}>
                {currentTime}
              </div>
              
              <div style={styles.navTabs}>
                {Object.values(SCHEDULE_DATA).map(schedule => (
                  <button
                    key={schedule.id}
                    style={{
                      ...styles.tabBtn,
                      ...(activeTab === schedule.id ? styles.activeTabBtn : {})
                    }}
                    className="tab-btn"
                    data-type={schedule.id}
                    onClick={() => handleTabClick(schedule.id)}
                  >
                    {schedule.title}
                  </button>
                ))}
              </div>

              {/* 动态渲染所有日程表 */}
              {Object.values(SCHEDULE_DATA).map(schedule => (
                <div
                  key={schedule.id}
                  id={schedule.id}
                  style={{
                    ...styles.scheduleTable,
                    ...(activeTab === schedule.id ? styles.activeTable : {})
                  }}
                  className="schedule-table"
                >
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>时间段</th>
                        <th style={styles.th}>活动内容</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.activities.map((activity, index) => 
                        renderActivityRow(
                          activity, 
                          index, 
                          index % 2 === 1 // 第二行开始为偶数行（索引从0开始）
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          );
        };

        return <ScheduleComponent />;
      }}
    </BrowserOnly>
  );
};

export default Schedule;
