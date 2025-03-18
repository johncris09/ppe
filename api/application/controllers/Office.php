<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Office extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('OfficeModel');
		$this->load->model('AccountableOfficerModel');

	}

	public function index_get()
	{
		$officeModel = new OfficeModel;
		$result = $officeModel->get();
		$this->response($result, RestController::HTTP_OK);
	}
	public function get_accountable_officer_get($office_id)
	{
		
		$accountableOfficerModel = new AccountableOfficerModel;
        $result = $accountableOfficerModel->get_accountable_officer([ 'office' => $office_id]);
        $this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{

		$officeModel = new OfficeModel;
		$result = $officeModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}


	public function insert_post()
	{

		$officeModel = new OfficeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'abbr' => trim($requestData['abbr']),
			'office ' => trim($requestData['office']), 

		);

		$result = $officeModel->insert($data);

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


		$officeModel = new OfficeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
	
		if (isset($requestData['abbr'])) {
			$data['abbr'] = trim($requestData['abbr']);
		}
		if (isset($requestData['office'])) {
			$data['office'] = trim($requestData['office']);
		} 

		$update_result = $officeModel->update($id, $data);

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
		$officeModel = new OfficeModel;
		$result = $officeModel->delete($id);
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
