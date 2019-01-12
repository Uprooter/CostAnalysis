import { connect } from 'react-redux'
import IntegratedUploadWithSnackbar from '../components/Upload'
import { updatePageName } from '../actions/actions'

const mapStateToProps = () => ({
})
const mapDispatchToProps = {
  updatePageName: updatePageName
}

export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(IntegratedUploadWithSnackbar)