import { connect } from 'react-redux'
import { State } from '../reducers'
import { getDetailedClusters } from '../selectors/detailedClusters'
import { addDetailedCluster } from '../actions/actions'
import DetailedCostCluster from '../components/admin/DetailedCostCluster'

// get my required props out of the state
const mapStateToProps = (state: State) => ({
  detailedClusters: getDetailedClusters(state)
})

const mapDispatchToProps = {
  onAddDetailedCluster: addDetailedCluster
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(DetailedCostCluster)