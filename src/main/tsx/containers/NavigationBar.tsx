import { connect } from 'react-redux'
import { State } from '../reducers'
import { triggerNavigationBar } from '../actions/actions'
import NavigationBar from '../components/NavigationBar'

// get my required props out of the state
const mapStateToProps = (state: State) => ({
    navigationOpen: state.navigationOpen.open
})

const mapDispatchToProps = {
    onTriggerNavigationBar: triggerNavigationBar
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(NavigationBar)