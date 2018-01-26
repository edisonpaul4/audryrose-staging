import React from 'react';
import PropTypes from 'prop-types';
import { Table, Segment, Form, Button } from "semantic-ui-react";

class EmailListReturnItemContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailSubject: '',
      emailText: ''
    };
  }
  componentWillMount() {
    this.setState({ 
      emailText: this.createEmailText(this.props),
      emailSubject: `Audry Rose ${this.props.returnType.slice(0, 1).toUpperCase() + this.props.returnType.slice(1)}`
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.returnId !== this.props.returnId)
      this.setState({
        emailText: this.createEmailText(newProps),
        emailSubject: `Audry Rose ${newProps.returnType.slice(0, 1).toUpperCase() + newProps.returnType.slice(1)}`
      });
  }

  createEmailText(props) {
    const { returnTypeId, customerName, productName, productClassification, returnOptions, isCheckedIn } = props;
    const capitalizedCustomerName = customerName
      .split(' ')
      .map(name => name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase());

    if(isCheckedIn)
      return emailTextCompleted
        .replace('{{CUSTOMER_NAME}}', capitalizedCustomerName[0])
        .replace('{{CLASSIFICATION}}', productClassification ? productClassification.slice(0, -1).toLowerCase() : '')
        .replace('{{REPAIRING_RESIZING}}', returnTypeId === 1 ? 'repairing' : 'resizing');


    switch (returnTypeId) {
      case 0:
        return emailTextReturn
          .replace('{{CUSTOMER_NAME}}', capitalizedCustomerName[0])
          .replace('{{PRODUCT_NAME}}', productName);

      case 1:
        return emailTextRepair
          .replace('{{CUSTOMER_NAME}}', capitalizedCustomerName[0])
          .replace('{{PRODUCT_NAME}}', productName)
          .replace('{{CLASSIFICATION}}', productClassification ? productClassification.slice(0, -1).toLowerCase() : '')

      case 2:
        const tempOption = returnOptions[returnOptions.length - 1];
        if (tempOption.newSize === 0)
          return emailTextUnknownResize
            .replace('{{CUSTOMER_NAME}}', capitalizedCustomerName[0]);
        else
          return emailTextKnownResize
            .replace('{{CUSTOMER_NAME}}', capitalizedCustomerName[0])
            .replace('{{SIZE}}', tempOption.newSize);

      default:
        return '';
    }
  }

  render() {
    const { returnId, returnType, onSenEmail } = this.props;
    const { emailText, emailSubject } = this.state;
    return (
      <Table.Row colSpan="12" as="td">
        <Segment loading={false} secondary={true}>
          <Form>
            <Form.Group>
              <Form.Input
                label="Subject"
                value={emailSubject}
                onChange={(e, { value }) => this.setState({ emailSubject: value })} />
            </Form.Group>

            <Form.Group widths='equal'>
              <Form.TextArea
                label="Message"
                value={emailText}
                onChange={(e, { value }) => this.setState({ emailText: value })}
                autoHeight={true} />
            </Form.Group>
          </Form>
          <Button
            color="red"
            content="Delete" />
          <Button
            color="green"
            content="Send"
            onClick={() => onSenEmail(returnId, { emailSubject, emailText })} />
        </Segment>
      </Table.Row>
    );
  }
}

EmailListReturnItemContent.propTypes = {
  returnId: PropTypes.string.isRequired,
  customerName: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  productClassification: PropTypes.string,
  returnType: PropTypes.string.isRequired,
  returnTypeId: PropTypes.number.isRequired,
  isCheckedIn: PropTypes.bool.isRequired,
  returnOptions: PropTypes.arrayOf(PropTypes.any),
  onSenEmail: PropTypes.func.isRequired
};

export default EmailListReturnItemContent;

const emailTextReturn = "Hi {{CUSTOMER_NAME}},\n\nSorry you did not love your {{PRODUCT_NAME}}!\n\nPlease find your return label attached. You can tape it to a small flat rate box and give it to your postman, or drop it off at any USPS box or office.\n\nOnce we receive it, we will issue you a full refund!\n\nIf you would like to see pictures of any other pieces kindly let me know and I would be happy to take them for you\n\nHave a wonderful day!";

const emailTextRepair = "Hi {{CUSTOMER_NAME}},\n\nSorry again that this happened to your {{PRODUCT_NAME}}! All of our pieces are covered by our lifetime warranty so we are happy to repair your {{CLASSIFICATION}} for you!\n\nPlease find your return label attached. You can tape it to a small flat rate box and give it to your postman, or drop it off at any USPS box or office.\n\nOnce we receive it, please allow 2 weeks for it to be repaired and shipped back to you.\n\nLet me know if you have any questions or concerns.\n\nThanks!";

const emailTextKnownResize = "Hi {{CUSTOMER_NAME}},\n\nSorry to hear your ring did not fit right, we will get that taken care of!\n\nPlease find your return label attached. You can tape it to a small flat rate box and give it to your postman, or drop it off at any USPS box or office.\n\nOnce we receive it, we will resize it to a {{SIZE}} for you! We will have it turned around to you within 10 days.\n\nHave a wonderful day!\n\nThanks!";

const emailTextUnknownResize = "Hi {{CUSTOMER_NAME}},\n\nSorry to hear your ring did not fit right, we will get that taken care of!\n\nPlease find your return label attached. You can tape it to a small flat rate box and give it to your postman, or drop it off at any USPS box or office.\n\nOnce we receive it, we will resize it to a [populate size] for you! We will have it turned around to you within 10 days.\n\nHave a wonderful day!";

const emailTextCompleted = "Hi {{CUSTOMER_NAME}}\n\nI just wanted to reach out and let you know we received your {{CLASSIFICATION}} and are going to get started {{REPAIRING_RESIZING}} it for you. Please allow about 1 week for us to work on it.  When it ships you will receive a tracking number.\n\nIf you have any questions or concerns kindly let me know\n\nThank you.";