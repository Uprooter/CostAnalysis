import { connect } from 'react-redux'
import CostOverview from '../components/CostOverview'
import { updatePageName } from '../actions/actions'

const mapStateToProps = () => ({
})
const mapDispatchToProps = {
  updatePageName: updatePageName
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(CostOverview)