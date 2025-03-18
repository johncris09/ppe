<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Patient extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('PatientModel');

	}

	public function index_get()
	{
		$patientModel = new PatientModel;
		$result = $patientModel->get();
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$patientModel = new PatientModel;
		$result = $patientModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$patientModel = new PatientModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'first_name' => trim($requestData['first_name']),
			'last_name' => trim($requestData['last_name']),
			'middle_name' => trim($requestData['middle_name']),
			'suffix' => trim($requestData['suffix']),

		);



		$result = $patientModel->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new user.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}

	public function update_put($id)
	{


		$patientModel = new PatientModel;
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

		$update_result = $patientModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$patientModel = new PatientModel;
		$result = $patientModel->delete($id);
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
