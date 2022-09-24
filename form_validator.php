<?php

  // contact form validation class
  class ContactFormValidator {

    protected $data;
    protected $errors = [];

    public function __construct($post_data) {
      $this->data = $post_data;
    }
    
    public function validateForm() {
      $this->validateName();
      $this->validateEmail();
      $this->validateSubject();
      $this->validateMessage();
      return $this->errors;
    }

    protected function validateName() {

      $val = $this->data['name'];
      
      if(empty($val)) {
        $this->addError('name', 'Name cannot be empty');
      } else {
        if(!preg_match('/^[a-zA-z]+([\s][a-zA-Z]+)*$/', $val)) {
          $this->addError('name', 'Name can only contain alphabets and spaces in between words');
        }
      }

    }

    protected function validateEmail() {
      
      $val = trim($this->data['email']);
      
      if(empty($val)) {
        $this->addError('email', 'Email cannot be empty');
      } else {
        if(!filter_var($val, FILTER_VALIDATE_EMAIL)) {
          $this->addError('email', 'Invalid email format');
        }
      }

    }

    private function validateSubject() {

      $val = $this->data['subject'];
      
      if(empty($val)) {
        $this->addError('subject', 'Subject cannot be empty');
      } else {
        if(!preg_match('/^[-@.\/#&+\w\s]*$/', $val)) {
          $this->addError('subject', 'Subject can only contain alphanumeric characters and these characters - @ . # + &');
        }
      }
      
    }

    protected function validateMessage() {

      $val = $this->data['message'];
      
      if(empty($val)) {
        $this->addError('message', 'Message cannot be empty');
      } else {
        if(!preg_match('/^[-@.\/#&+\w\s]*$/', $val)) {
          $this->addError('message', 'Message can only contain alphanumeric characters and these characters - @ . # + &');
        }
      }
      
    }

    protected function addError($key, $val) {
      $this->errors[$key] = $val;
    }

  }

  // reservation form validation class
  class ResevationFormValidator extends ContactFormValidator {
    
    public function validateReservationForm() {
      $this->validateName();
      $this->validateEmail();
      $this->validatePhone();
      $this->validateDate();
      $this->validateTime();
      $this->validatePeople();
      $this->validateMessage();
      return $this->errors;
    }

    private function validatePhone() {

      $val = $this->data['phone'];
      
      if(empty($val)) {
        $this->addError('phone', 'Phone cannot be empty');
      } else {
        if(!preg_match('/^[0-9\-\(\)\/\+\s]*$/', $val)) {
          $this->addError('phone', 'Invalid phone number');
        }
      }

    }

    private function validateDate() {

      $val = $this->data['date'];
      
      if(empty($val)) {
        $this->addError('date', 'Date cannot be empty');
      } else {
        if(!preg_match('/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/', $val)) {
          $this->addError('date', 'Date can be in either dd/mm/yyyy, dd-mm-yyyy or dd.mm.yyyy format');
        }
      }
      
    }

    private function validateTime() {

      $val = $this->data['time'];
      
      if(empty($val)) {
        $this->addError('time', 'Time cannot be empty');
      } else {
        if(!preg_match('/^(0?[1-9]|1[0-2]):([0-5]\d)\s?((?:A|P)\.?M\.?)$/i', $val)) {
          $this->addError('time', 'Time must be in 12hour format with either am or pm eg 1:30pm or 4:05am');
        }
      }

    }

    private function validatePeople() {

      $val = intval($this->data['people']);
      
      if(empty($val)) {
        $this->addError('people', 'people cannot be empty');
      } else {
        if($val < 1) {
          $this->addError('people', 'Number of people must be an integer and must be 1 or greater');
        }
      }

    }

  }

  // check if it is contact form or reservation form
  if(isset($_POST['phone'])) {
    $validation = new ResevationFormValidator($_POST);
    $errors = $validation->validateReservationForm();
  } else {
    $validation = new ContactFormValidator($_POST);
    $errors = $validation->validateForm();
  }

  echo json_encode($errors);

?>