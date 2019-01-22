import { connect } from 'react-redux'
import { State } from '../reducers'
import { getDetailedClusters } from '../selectors/detailedClusters'
import { addDetailedCluster } from '../actions/actions'
import DetailedClusterAdmin from '../components/admin/DetailedClusterAdmin'
import { updatePageName } from '../actions/actions'

// get my required props out of the state
const mapStateToProps = (state: State) => ({
  detailedClusters: getDetailedClusters(state)
})

const mapDispatchToProps = {
  onAddDetailedCluster: addDetailedCluster,
  updatePageName: updatePageName
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(DetailedClusterAdmin)