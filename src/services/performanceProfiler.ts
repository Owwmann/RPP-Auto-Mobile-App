// Performance monitoring and optimization
export interface PerformanceMetrics {
  screen_name: string;
  load_time: number;
  render_time: number;
}

class PerformanceProfiler {
  private static instance: PerformanceProfiler;
  
  static getInstance(): PerformanceProfiler {
    if (!PerformanceProfiler.instance) {
      PerformanceProfiler.instance = new PerformanceProfiler();
    }
    return PerformanceProfiler.instance;
  }
}

export default PerformanceProfiler;