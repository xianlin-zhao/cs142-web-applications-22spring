import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
    this.state = {
      allStates: window.cs142models.statesModel(),
      query: "",
    };

    this.handleChangeQuery = event => this.handleChange(event);
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  generateAnswer(sub) {
    const satisfy = [];
    
    for (let i = 0; i < this.state.allStates.length; i++) {
      let nowStr = this.state.allStates[i];
      if (nowStr.toLowerCase().includes(sub.toLowerCase())) {
        satisfy.push(<li key={nowStr}> {nowStr} </li>);
      }
    }

    if (satisfy.length === 0) {
      return "Sorry, there are no matching states...";
    } else {
      const retVal = (
        <div>
          <ul>{satisfy}</ul>
        </div>
      );
      return retVal;
    }
  }

  render() {
    return (
      <div className='cs142-states-container'>
        <div className='cs142-states-queryInput'>
          <label> Input a substring, we will display the names of all states containing this substring: &nbsp;&nbsp;
          </label>
          <input type="text" value={this.state.query} onChange={this.handleChangeQuery} />
        </div>

        <div className='cs142-states-answerOutput'>
          {this.generateAnswer(this.state.query)}
        </div>
      </div>
    );
  }
}

export default States;
