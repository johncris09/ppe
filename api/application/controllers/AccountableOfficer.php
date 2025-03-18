<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class AccountableOfficer extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('AccountableOfficerModel');

	}

	public function index_get()
	{
		$accountableOfficerModel = new AccountableOfficerModel;
		$result = $accountableOfficerModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function insert_post()
	{

		$accountableOfficerModel = new AccountableOfficerModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'first_name' => trim($requestData['first_name']),
			'last_name ' => trim($requestData['last_name']), 
			'middle_name ' => trim($requestData['middle_name']), 
			'suffix ' => trim($requestData['suffix']), 
			'assumption_date ' =>  $requestData['assumption_date'],  
			'designation ' => trim($requestData['designation']), 
			'title ' => trim($requestData['title']), 
			'credentials ' => trim($requestData['credentials']), 
			'office ' => trim($requestData['office']),  

		);

		$result = $accountableOfficerModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_OK);
		}
	}

	public function update_put($id)
	{


		$accountableOfficerModel = new AccountableOfficerModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
	
		if (isset($requestData['first_name'])) {
			$data['first_name'] = trim($requestData['first_name']);
		}
		if (isset($requestData['last_name'])) {
			$data['last_name'] = trim($requestData['last_name']);
		}
		if (isset($requestData['middle_name'])) {
			$data['middle_name'] = trim($requestData['middle_name']);
		}
		if (isset($requestData['suffix'])) {
			$data['suffix'] = trim($requestData['suffix']);
		}
		if (isset($requestData['assumption_date'])) {
			$data['assumption_date'] =  $requestData['assumption_date'] ;
		}
		if (isset($requestData['designation'])) {
			$data['designation'] = trim($requestData['designation']);
		}
		if (isset($requestData['title'])) {
			$data['title'] = trim($requestData['title']);
		}
		if (isset($requestData['credentials'])) {
			$data['credentials'] = trim($requestData['credentials']);
		}
		if (isset($requestData['office'])) {
			$data['office'] = trim($requestData['office']);
		} 
 


		$update_result = $accountableOfficerModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_OK);

		}
	}


	public function delete_delete($id)
	{
		$accountableOfficerModel = new AccountableOfficerModel;
		$result = $accountableOfficerModel->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
