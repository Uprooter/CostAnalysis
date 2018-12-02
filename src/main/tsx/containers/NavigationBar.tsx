import { connect } from 'react-redux'
import { State } from '../reducers'
import { triggerNavigationBar, updatePageName } from '../actions/actions'
import NavigationBar from '../components/NavigationBar'
import { push } from 'connected-react-router'

// get my required props out of the state
const mapStateToProps = (state: State) => ({
    navigationOpen: state.navigationBar.open,
    pageName: state.navigationPage.pageName
})

const mapDispatchToProps = {
    onTriggerNavigationBar: triggerNavigationBar,
    updatePageName: updatePageName,
    push: push
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(NavigationBar)