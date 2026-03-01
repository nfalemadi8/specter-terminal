import { Component } from 'react';

export default class TabErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center bg-bb-black">
          <div className="text-center p-4 border border-bb-red/50 bg-bb-red/5 max-w-md">
            <div className="text-bb-red text-sm font-bold mb-2">MODULE ERROR</div>
            <div className="text-bb-muted text-[10px] mb-3">
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-3 py-1 text-[10px] border border-bb-amber text-bb-amber hover:bg-bb-amber/10"
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
