import InvoiceForm from './components/InvoiceForm'
import InvoiceList from './components/InvoiceList' // Add this line

function App() {
  return (
    <div className="App max-w-4xl mx-auto p-4">
      <InvoiceForm />
      <hr className="my-10" />
      <InvoiceList /> {/* Add this line */}
    </div>
  )
}

export default App
